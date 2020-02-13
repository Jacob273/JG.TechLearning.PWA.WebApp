var DAL;
(function (DAL) {
    class Project {
        constructor(parentProjectNumber, projectNumber, workingDate, workingHours) {
            this.ParentProjectNumber = parentProjectNumber;
            this.ProjectNumber = projectNumber;
            this.WorkingDate = workingDate;
            this.WorkingHours = workingHours;
        }
        Display() {
            console.log("Polish Project Number " + this.ParentProjectNumber);
        }
    }
    DAL.Project = Project;
    class TspaDatabase {
        constructor() {
            this.DatabaseVersion = "2";
            this.DatabaseName = "TSPA.Database";
            this.ProjectsStorageName = "ProjectsStore";
        }
        BuildIfNeeded(indexedDb) {
            console.log("IndexedDB component can be used. Trying to connect to: " + this.DatabaseName + ", version " + this.DatabaseVersion);
            var connection = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
            connection.onerror = function (event) {
                console.log("Error! IndexedDB cannot be used!" + event.target.result);
            };
            connection.onsuccess = function (event) {
                console.log("Success! IndexedDB is ready to use!");
                var tspaDatabase = event.target.result;
                tspaDatabase.close();
            };
            connection.onupgradeneeded = function (event) {
                console.log("Upgrade is required! Processing...");
                var tspaDatabase = event.target.result;
                var objectStore = tspaDatabase.createObjectStore("ProjectsStore", { keyPath: "ParentProjectNumber" });
                objectStore.createIndex("WorkingDate", "WorkingDate", { unique: false });
                objectStore.createIndex("ParentProjectNumber", "ParentProjectNumber", { unique: true });
                objectStore.transaction.oncomplete = function (event) {
                    var ProjectsStore = tspaDatabase
                        .transaction("ProjectsStore", "readwrite")
                        .objectStore("ProjectsStore");
                    let projectRep = new ProjectRepository();
                    projectRep.Data.forEach(function (projectData) {
                        console.log("Adding to database " + projectData.ParentProjectNumber);
                        ProjectsStore.add(projectData);
                    });
                };
                objectStore.transaction.onerror = function (event) {
                    console.log("transaction error");
                };
            };
        }
        GetProject(parentProjectNumberToSearch, onGetDataCallback) {
            console.log("Retrieving data related to project with number: " + parentProjectNumberToSearch);
            var indexedDb = this.GetIndexedDbComponent();
            if (!indexedDb) {
                console.log("Cannot access indexedDb...");
                onGetDataCallback(null);
            }
            var request = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
            request.onsuccess = function (event) {
                console.log("Connection established to: " + this.DatabaseName);
                var tspaDatabase = event.target.result;
                tspaDatabase.transaction("ProjectsStore")
                    .objectStore("ProjectsStore")
                    .get(parentProjectNumberToSearch)
                    .onsuccess = function (event) {
                    console.log(" 1 " + event.target.result);
                    onGetDataCallback(event.target.result);
                },
                    onerror = function (event) {
                        console.log("Transaction::Get error.");
                    };
            };
        }
        GetIndexedDbComponent() {
            return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        }
    }
    DAL.TspaDatabase = TspaDatabase;
    class ProjectRepository {
        constructor() {
            this.Data = [
                new Project("999-44-4444", "001", new Date("2020-01-20"), 5),
                new Project("888-44-4444", "002", new Date("2020-01-21"), 3),
                new Project("777-44-4444", "003", new Date("2020-01-22"), 7),
                new Project("666-44-4444", "004", new Date("2020-01-23"), 8),
                new Project("555-44-4444", "005", new Date("2020-01-24"), 3),
                new Project("444-44-4444", "006", new Date("2020-01-25"), 2),
                new Project("333-44-4444", "007", new Date("2020-01-26"), 1),
                new Project("222-44-4444", "008", new Date("2020-01-27"), 2)
            ];
        }
    }
})(DAL || (DAL = {}));
//# sourceMappingURL=TspaDatabase.js.map