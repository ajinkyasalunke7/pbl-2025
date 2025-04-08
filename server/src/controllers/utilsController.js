import fs from "fs";
// import csv from "csv";
import * as csv from "csv";
import path from "path";

let colleges = [];

const filePath = path.resolve("src/controllers/data/database.csv");

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error("[cAPi] : Error reading file", err);
    return;
  }

  // console.log("[cAPi] : File read!");
  csv.parse(data, function (err, data) {
    if (err) {
      console.error("[cAPi] : Error parsing CSV data");
      return;
    }
    colleges = data;
    // console.log("[cAPi] : CSV Loaded!");
  });
});

export const getTotalColleges = (req, res) => {
  const result = { total: colleges.length };
  res.json(result);
};

export const searchColleges = (req, res) => {
  const { keyword } = req.body;
  const result = [];

  for (let i = 0; i < colleges.length; i++) {
    if (colleges[i][2].toLowerCase().includes(keyword.toLowerCase())) {
      // Clean up text
      colleges[i][2] = colleges[i][2].replace(/\:[^>]*\)/gi, "");
      colleges[i][2] = colleges[i][2].replace(/(\(Id)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/\:[^>]*\)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/(\(Id)/gi, "");

      result.push(colleges[i]);
    }
  }

  res.json(result);
};

// Function to get colleges by state
export const getCollegesByState = (req, res) => {
  const { state, offset = 0 } = req.body;
  const result = [];

  for (let i = 0; i < colleges.length; i++) {
    if (colleges[i][4].toLowerCase().includes(state.toLowerCase())) {
      // Clean up text
      colleges[i][2] = colleges[i][2].replace(/\:[^>]*\)/gi, "");
      colleges[i][2] = colleges[i][2].replace(/(\(Id)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/\:[^>]*\)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/(\(Id)/gi, "");

      result.push(colleges[i]);
    }
  }

  const limitResult = result.slice(offset, offset + 10); // Limit results based on offset
  res.json(limitResult);
};

// Function to get colleges by district
export const getCollegesByDistrict = (req, res) => {
  const { district, offset = 0 } = req.body; // Accessing district and offset from body
  const result = [];

  for (let i = 0; i < colleges.length; i++) {
    if (colleges[i][5].toLowerCase().includes(district.toLowerCase())) {
      // Clean up text
      colleges[i][2] = colleges[i][2].replace(/\:[^>]*\)/gi, "");
      colleges[i][2] = colleges[i][2].replace(/(\(Id)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/\:[^>]*\)/gi, "");
      colleges[i][1] = colleges[i][1].replace(/(\(Id)/gi, "");

      result.push(colleges[i]);
    }
  }

  const limitResult = result.slice(offset, offset + 10); // Limit results based on offset
  res.json(limitResult);
};

// Function to get all states
export const getAllStates = (req, res) => {
  const result = [];

  for (let i = 1; i < colleges.length; i++) {
    if (!result.includes(colleges[i][4])) {
      result.push(colleges[i][4]);
    }
  }

  res.json(result);
};

// Function to get all districts by state
export const getDistrictsByState = (req, res) => {
  const { state } = req.body; // Accessing state from body
  const result = [];

  for (let i = 0; i < colleges.length; i++) {
    if (colleges[i][4].toLowerCase().includes(state.toLowerCase())) {
      if (!result.includes(colleges[i][5])) {
        result.push(colleges[i][5]);
      }
    }
  }

  res.json(result);
};
