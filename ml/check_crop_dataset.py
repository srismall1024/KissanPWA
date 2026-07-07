import pandas as pd

df = pd.read_csv("C:\\Users\\Success\\Desktop\\adsa\\.vscode\\practise\\week3\\semlab\\KissanPWA\\ml\\dataset\\Crop and fertilizer dataset.csv")

print(df.head())

print("\nColumns:")
print(df.columns.tolist())

print("\nShape:")
print(df.shape)