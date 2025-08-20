import React from "react";
import ChartTemplate from "../components/charts/ChartTemplate";
import { Grid, Paper, Typography } from "@mui/material";

export default function ChartPage() {
  const sales = [4, 3, 5];
  const expenses = [2, 6, 3];
  const categories = ["Q1", "Q2", "Q3"];

  const palette = [
    "#1F77B4", // Deep Blue
    "#9467BD", // Royal Purple
    "#2CA02C", // Emerald Green
    "#D62728", // Strong Crimson
    "#FF7F0E", // Vibrant Orange
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Chart Pages
      </Typography>

      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} style={{ padding: "16px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Sales vs Expenses (Bar)
            </Typography>
            <ChartTemplate
              type="bar"
              series={[
                { data: sales, label: "Sales", stack: "data" },
                { data: expenses, label: "Expenses", stack: "data" },
              ]}
              xAxis={[{ data: categories, scaleType: "band" }]}
              height={300}
              layout="vertical"
              borderRadius={8}
              barLabel="value"
              grid={{ vertical: true }}
              colors={palette}
              margin={{ bottom: 30, right: 20, top: 20 }}
              legendPosition="bottom"
            />
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} style={{ padding: "16px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Sales vs Expenses (Line)
            </Typography>
            <ChartTemplate
              type="line"
              series={[
                { data: sales, label: "Sales" },
                { data: expenses, label: "Expenses" },
              ]}
              xAxis={[{ data: categories, scaleType: "point" }]}
              height={300}
              grid={{ vertical: true, horizontal: true }}
              colors={palette}
              margin={{ bottom: 30, right: 20, top: 20 }}
              legendPosition="bottom"
            />
          </Paper>
        </Grid>

        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} style={{ padding: "16px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Sales vs Expenses (Area)
            </Typography>
            <ChartTemplate
              type="line"
              area
              series={[
                { data: sales, label: "Sales" },
                { data: expenses, label: "Expenses" },
              ]}
              xAxis={[{ data: categories, scaleType: "point" }]}
              height={300}
              grid={{ vertical: true, horizontal: true }}
              colors={palette}
              margin={{ bottom: 30, right: 20, top: 20 }}
              legendPosition="bottom"
            />
          </Paper>
        </Grid>

        {/* Donut Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} style={{ padding: "16px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Distribution (Donut)
            </Typography>
            <ChartTemplate
              type="donut"
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "Sales" },
                    { id: 1, value: 7, label: "Expenses" },
                    { id: 2, value: 5, label: "Other" },
                  ],
                },
              ]}
              height={300}
              colors={palette}
              legendPosition="bottom"
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
