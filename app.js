const path = require("path");
const express = require("express");
const hbs = require("hbs");
var request = require("request");
var Handlebars = require("hbs");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

app.set("view engine", "hbs");
const viewsPath = path.join(__dirname, "views");
app.set("views", viewsPath);

// Handlebars.registerHelper("json", function(context) {
//   return JSON.stringify(context);
// });

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //total world
  var options1 = {
    method: "GET",
    url: "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
    json: true,
    headers: {
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
    }
  };

  request(options1, function(error, response, body) {
    if (error) throw new Error(error);

    console.log("total cases: around the World is: " + body.total_cases);

    const total_cases = body.total_cases;
    console.log("total deaths :" + body.total_deaths);

    //india cases
    var options2 = {
      method: "GET",
      url:
        "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
      json: true,
      headers: {
        "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
        "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
      }
    };

    request(options2, function(error, response, body1) {
      if (error) throw new Error(error);
      let d = JSON.stringify(body1);
      let sta = body1.statistic_taken_at;
      console.log(d);
      console.log(sta);

      res.render("index", {
        title: "DATA",
        tc: body.total_cases,
        td: body.total_deaths,
        tr: body.total_recovered,
        tnc: body.new_cases,
        tnd: body.new_deaths,

        hello: d,
        sta
      });
    });
  });
});

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/search", (req, res) => {
  console.log(req.body.sbc);

  const cname = req.body.sbc;

  var options = {
    method: "GET",
    url:
      "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php",
    json: true,
    qs: { country: cname },
    headers: {
      "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
      "x-rapidapi-key": "8ca55d83ccmsha37b92cc7723a3cp17ec51jsnb62a8633e050"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    // console.log(body);
    // var b = JSON.parse()
    if (Object.keys(body.latest_stat_by_country).length === 0) {
      return res.render("search", {
        err: "Check Spelling or result not Found"
      });
    } else {
      res.render("search", {
        country: body.country,
        tc: body.latest_stat_by_country[0].total_cases,
        nc: body.latest_stat_by_country[0].new_cases,
        ac: body.latest_stat_by_country[0].active_cases,
        td: body.latest_stat_by_country[0].total_deaths,
        nd: body.latest_stat_by_country[0].new_deaths,
        trc: body.latest_stat_by_country[0].total_recovered,
        sc: body.latest_stat_by_country[0].serious_critical,
        tcpm: body.latest_stat_by_country[0].total_cases_per1m,
        rd: body.latest_stat_by_country[0].record_date
      });
    }
  });
});

app.get("/instruction", (req, res) => {
  res.render("instruction");
});

app.get("/myth", (req, res) => {
  res.render("myth");
});

app.listen(port, () => {
  console.log("Server is Up on Port" + port);
});
