# Chart Project

This project is a React application for displaying charts using
Recharts.

📊 Features

Displays conversion rate data over time.
Supports multiple variations simultaneously.
Users can select which variations to display.

Aggregation Options
Aggregate data by day or by week.
Switching between aggregations updates the chart in real-time.

Line Style Customization
Choose between Line, Smooth, or Area chart styles.
Styles update dynamically without reloading data.

Zooming Controls. Zoom in and zoom out on the chart.
Automatically adapts to data range.

Reset Zoom
Restore the chart to show all available data.

Export to PNG
Download the chart as a PNG image.
Preserves current view and selected variations.

Theme Toggle
Switch between light and dark mode.
Dynamically changes chart and control panel colors.

Custom Tooltip
Shows detailed information on hover.
Displays conversion rate, visits, and conversions per variation.

## 🚀 Live Deployment (GitHub Pages)

The app can be deployed to **GitHub Pages** using the provided npm
scripts.

### **GitHub Pages Deployment Instructions**

1.  Make sure your `package.json` contains:

    -   `"homepage": "https://<your-username>.github.io/<repo-name>"`

    -   Scripts:
     
        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"


2.  Install dependencies:

    npm install

3.  Initialize Git repository (if not already):

    git init
    git remote add origin https://github.com/<your-username>/<repo-name>.git

4.  Deploy:

    npm run deploy


GitHub Pages will serve the app from the `gh-pages` branch.

------------------------------------------------------------------------

## 🖥️ Running Locally

To run the app on your local machine:

### **1. Install dependencies**

npm install

### **2. Start development server**

npm start


The app will be available at:

    http://localhost:3000

### **3. Build for production**

npm run build


This generates an optimized bundle in the `build/` folder.

