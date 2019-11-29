class ServiceLocator {
    static init() {
        this.registeredClasses = new Map();
        this.initialised = true;
    }
    static register(t, instance) {
        if (!this.initialised) {
            this.init();
        }
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        this.registeredClasses.set(interfaceName, instance);
    }
    static resolve(t) {
        let interfaceInstance = new t();
        let interfaceName = interfaceInstance.constructor.name;
        return this.registeredClasses.get(interfaceName);
    }
}
ServiceLocator.initialised = false;
export default ServiceLocator;
