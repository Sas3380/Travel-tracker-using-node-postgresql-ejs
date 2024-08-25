import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



async function checkVisited(){
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    let countries = [];
    //push new country into countries array
    result.rows.forEach((country)=>{
      countries.push(country.country_code);
    });
    return countries;
  } catch(error){
    console.error("Error fetching visited countries:", error);
  }
}

app.get("/", async (req, res)=>{
  try {
    const countries = await checkVisited();
    res.render("index.ejs", {countries: countries, total: countries.length})
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});



app.post("/add",async(req,res)=>{
  const countryName = req.body["country"];

  //get the country code
  try {

    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [countryName.toLowerCase()]
    );

    const countryCode = result.rows[0].country_code;//first element


    try {
          await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",
            [countryCode]
          );
          res.redirect("/");
      } catch (err) {
        const countries = await checkVisited();
        res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
      }
  } catch (err) {
      console.log(err)
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country does not exist",
      });
  }
})

app.post("/remove",async (req,res)=>{
  const countryName = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
        [countryName.toLowerCase()]
    );
  
    const countryCode = result.rows[0].country_code;
  
    try {
      const deleteResult = await db.query(
        "DELETE FROM visited_countries WHERE country_code = $1",
        [countryCode]
      );
    
      res.redirect('/');
    } catch (error) {
      const countries = await checkVisited();
      res.render("index.ejs",{
        countries: countries,
        total: countries.length,
        error: "Country not found in the visited list",
      })
    }
  } catch (error) {
    console.error(error.message);
    const countries = await checkVisited();

    res.render("index.ejs",{
      countries: countries,
      total: countries.length,
      error: "Country does not exist",
    })
  }

})




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
