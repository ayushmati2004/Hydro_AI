"""
Seed demo synthetic CSVs for 3 crops over 180 days and multiple strategies.
Run: python scripts/seed_demo_data.py
"""
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend', 'data', 'uploads')
os.makedirs(OUT_DIR, exist_ok=True)

start = datetime.utcnow() - timedelta(days=180)
days = 180
crops = ['basil','lettuce','tomato']
strategies = ['static','adaptive','RL']

for strategy in strategies:
    rows = []
    for i in range(days):
        d = (start + timedelta(days=i)).date().isoformat()
        for crop in crops:
            water = max(0.5, np.random.normal(1.0 if crop=='basil' else 0.8 if crop=='lettuce' else 1.5, 0.1))
            nutrient = max(10, np.random.normal(40 if crop=='basil' else 25 if crop=='lettuce' else 60, 5))
            light = max(6, np.random.normal(10,1))
            biomass = max(0, np.random.normal(0.1 if crop=='basil' else 0.08 if crop=='lettuce' else 0.2, 0.02))
            if strategy=='adaptive':
                biomass *= 1.05
            if strategy=='RL':
                biomass *= 1.12
            rows.append({'date':d,'crop':crop,'water_liters':water,'nutrient_mg':nutrient,'light_hours':light,'biomass':biomass,'strategy':strategy})
    df = pd.DataFrame(rows)
    fname = os.path.join(OUT_DIR, f'seed_{strategy}.csv')
    df.to_csv(fname, index=False)
    print('Wrote', fname)

print('Seed complete.')
