"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var lyricsRouter_1 = __importDefault(require("./routers/lyricsRouter"));
var jishoRouter_1 = __importDefault(require("./routers/jishoRouter"));
var fetchRouter_1 = __importDefault(require("./routers/fetchRouter"));
var cors_1 = __importDefault(require("./middlewares/cors"));
var app = express_1.default();
var port = 8080;
app.use(express_1.default.json());
app.use(cors_1.default);
app.get('/', function (req, res) {
    res.send('hello world');
});
app.use('/api/lyrics', lyricsRouter_1.default);
app.use('/api/jisho', jishoRouter_1.default);
app.use('/api/fetch', fetchRouter_1.default);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(port, function () { return console.log("listening on port " + port); });
