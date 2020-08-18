const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require("moment");
moment().format()
const SettingsBill = require("./settings-bill")
const app = express();
const settingsBill = SettingsBill();
const list = settingsBill.actions();

app.engine('handlebars', exphbs({
  defaultLayout: 'main'

}));

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts'
}));
app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.render('index', {
      settings: settingsBill.getSettings(),
      totals: settingsBill.totals()
    });
});

app.post('/settings', function(req, res){

  settingsBill.setSettings({
      callCost: req.body.callCost,
      smsCost: req.body.smsCost,
      warningLevel: req.body.warningLevel,
      criticalLevel: req.body.criticalLevel
    });
    console.log(settingsBill.getSettings())
    res.redirect('/');
});
app.post('/action', function(req, res){
  settingsBill.recordAction(req.body.actionType)
  res.redirect('/');
});
app.get('/actions', function(req, res){
  for (const key of list){
    key.ago = moment(key.timestamp).fromNow() 
    console.log(key.ago)
  }
  res.render('actions', {
    actions: list
  })
});
app.get('/actions/:actionType', function(req, res){
  const actionType = req.params.actionType;
  const actionsList = settingsBill.actionsFor(actionType)
  for (const key of actionsList){
    key.ago = moment(key.timestamp).fromNow() 
  }

  res.render('actions', {
    actions: actionsList
  })

});
const PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});