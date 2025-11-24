from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from . import db, crud, models, schemas, utils
import os
import shutil
import pandas as pd
from typing import List

app = FastAPI(title="Hydro_AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@app.on_event("startup")
def startup():
    db.init_db()
    os.makedirs("./data/uploads", exist_ok=True)


# Ensure DB tables exist at import time for tests and quick scripts
try:
    db.init_db()
except Exception:
    pass
try:
    os.makedirs("./data/uploads", exist_ok=True)
except Exception:
    pass


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = utils.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    email = payload.get("sub")
    with Session(db.engine) as session:
        user = crud.get_user_by_email(session, email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user


@app.post("/api/auth/signup", response_model=schemas.UserRead)
def signup(user_in: schemas.UserCreate):
    with Session(db.engine) as session:
        existing = crud.get_user_by_email(session, user_in.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = crud.create_user(session, user_in.email, user_in.password, user_in.display_name)
        return schemas.UserRead(id=user.id, email=user.email, display_name=user.display_name)


@app.post("/api/auth/login", response_model=schemas.Token)
def login(email: str = Form(...), password: str = Form(...)):
    with Session(db.engine) as session:
        user = crud.get_user_by_email(session, email)
        if not user or not utils.verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        token = utils.create_access_token(user.email, expires_delta=60*24)
        return schemas.Token(access_token=token)


@app.get("/api/auth/me", response_model=schemas.UserRead)
def me(user: models.User = Depends(get_current_user)):
    return schemas.UserRead(id=user.id, email=user.email, display_name=user.display_name)


@app.post("/api/datasets")
def upload_dataset(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    filename = file.filename
    dest = f"./data/uploads/{filename}"
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        df = pd.read_csv(dest)
        rows = len(df)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")
    with Session(db.engine) as session:
        ds = crud.create_dataset(session, dest, uploader_id=current_user.id, rows=rows, original_name=filename)
    return {"id": ds.id, "rows": rows}


@app.get("/api/datasets")
def list_datasets(current_user: models.User = Depends(get_current_user)):
    with Session(db.engine) as session:
        ds = crud.list_datasets(session)
        return ds


@app.get("/api/datasets/{dataset_id}/preview")
def preview_dataset(dataset_id: int, n: int = 10, current_user: models.User = Depends(get_current_user)):
    with Session(db.engine) as session:
        stmt = session.get(models.Dataset, dataset_id)
        if not stmt:
            raise HTTPException(status_code=404, detail="Dataset not found")
        path = stmt.filename
    try:
        df = pd.read_csv(path)
        return df.head(n).to_dict(orient="records")
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read dataset")


@app.get("/api/metrics/overview")
def metrics_overview(current_user: models.User = Depends(get_current_user)):
    import glob
    import numpy as np
    files = glob.glob("./data/uploads/*.csv")
    total_yield = 0.0
    water_total = 0.0
    nutrient_total = 0.0
    rows = 0
    for f in files:
        try:
            df = pd.read_csv(f)
            rows += len(df)
            if "biomass" in df.columns:
                total_yield += df["biomass"].sum()
            if "water_liters" in df.columns:
                water_total += df["water_liters"].sum()
            if "nutrient_mg" in df.columns:
                nutrient_total += df["nutrient_mg"].sum()
        except Exception:
            continue
    wue = total_yield / (water_total + 1e-9)
    nue = total_yield / (nutrient_total + 1e-9)
    fairness = float(np.random.rand())
    return {"total_yield": total_yield, "water_use_efficiency": wue, "nutrient_efficiency": nue, "fairness_index": fairness, "rows": rows}


@app.get("/api/metrics")
def metrics(start: str = None, end: str = None, crop: str = None, strategy: str = None, metric: str = "biomass", current_user: models.User = Depends(get_current_user)):
    import glob
    import pandas as pd
    files = glob.glob("./data/uploads/*.csv")
    all_df = []
    for f in files:
        try:
            df = pd.read_csv(f, parse_dates=["date"]) if "date" in pd.read_csv(f, nrows=0).columns else pd.read_csv(f)
            all_df.append(df)
        except Exception:
            continue
    if not all_df:
        return {"series": []}
    df = pd.concat(all_df, ignore_index=True)
    if crop:
        df = df[df["crop"] == crop]
    if strategy:
        df = df[df["strategy"] == strategy]
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        res = df.groupby("date")[metric].sum().reset_index()
        return res.to_dict(orient="records")
    else:
        return {"series": []}

