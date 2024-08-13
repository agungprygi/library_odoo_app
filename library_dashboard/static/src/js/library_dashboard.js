import { registry } from "@web/core/registry";
const actionRegistry = registry.category("actions");

class LibraryDashboard extends owl.Component{
    setup(){
        console.log("Library Dashboard component is initialized");
    }
};

LibraryDashboard.template = LibraryDashboard;
console.log("Registering LibraryDashboard component");
actionRegistry.add('library_dashboard_tag', LibraryDashboard);