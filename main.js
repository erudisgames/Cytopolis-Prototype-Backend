define("controller", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function CreateCharacter(args) {
        log.info("hello World!");
        return true;
    }
    exports.default = { CreateCharacter };
});
define("main", ["require", "exports", "controller"], function (require, exports, controller_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    handlers["CreateCharacter"] = controller_1.default.CreateCharacter;
});
