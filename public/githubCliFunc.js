"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const gradient_string_1 = __importDefault(require("gradient-string"));
class githubCliFunc {
    constructor() {
        // timout function
        this.TimeOut = (millisec) => {
            new Promise((r) => setTimeout(r, millisec));
        };
        // welcome function
        this.Welcome = () => __awaiter(this, void 0, void 0, function* () {
            const msg = `\t\tHello\n`;
            (0, figlet_1.default)(msg, (err, data) => {
                console.log(gradient_string_1.default.pastel.multiline(data));
            });
            this.TimeOut(1000);
        });
    }
}
exports.default = githubCliFunc;
