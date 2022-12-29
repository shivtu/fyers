import fs from "fs";

export const getAccessToken = () => {
  const dbData = fs.readFileSync("db/db.json", { encoding: "utf8" });
  const accessToken = JSON.parse(dbData).accessToken;

  return accessToken;
};
