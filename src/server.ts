import express from 'express';
import bodyParser from 'body-parser';
import Routes from './routes/routes';
import Controller from './interfaces/controller.interface';
import ScheduleController from './schedule/schedule.controller';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const controllers: Controller[] = [
  new ScheduleController()
];

const routes = new Routes(app, controllers);

app.listen(port, () => {
  return console.log(`server is listening on http://localhost:${port}`);
});