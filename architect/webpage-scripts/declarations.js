
//LOADING
let physics = {},
    state = {},
    entities = {},
    ioput = {},
    assets = {};

const KILL = -1;
const BEGIN_START_MENU = 0;
const STAGNANT_START_MENU = 1;
const BEGIN_LEVEL_SELECT = 2;
const STAGNANT_LEVEL_SELECT = 3;
const SERVER = "http://127.0.0.1:3/"
const ROOT = "Users/Administrator/Download/architect/"
const ASSET_PATH = "assets/models/";
const GLB = ".glb";

const VIEW_3D = 1;
const PLAN_VIEW = 2;

const SUMMER = 10;
const WINTER = 11;
const FALL =   12;
const SPRING = 13;

const CAMERA = "camera";
const BUILDING = "building"

const WORLD_BOUNDS = 1000;
const GRAVITY = 9.8;