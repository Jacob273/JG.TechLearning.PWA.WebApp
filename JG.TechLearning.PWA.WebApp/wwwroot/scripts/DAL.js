var DAL;
(function (DAL) {
    class Project {
        constructor(parentProjectNumber, projectNumber, workingDate, workingHours, file = null) {
            this.ParentProjectNumber = parentProjectNumber;
            this.ProjectNumber = projectNumber;
            this.WorkingDate = workingDate;
            this.WorkingHours = workingHours;
            this.File = file; //optional?
        }
        Display() {
            console.log("Polish Project Number " + this.ParentProjectNumber);
        }
    }
    DAL.Project = Project;
    class TspaDatabase {
        constructor(databaseName = "TSPA.Database", databaseVersion = "2", projectsStorageName = "ProjectsStore") {
            this.DatabaseName = databaseName;
            this.DatabaseVersion = databaseVersion;
            this.ProjectsStorageName = projectsStorageName;
        }
        BuildIfNeeded(indexedDb) {
            console.log("IndexedDB component can be used. Trying to connect to: " + this.DatabaseName + ", version " + this.DatabaseVersion + ".");
            var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
            openRequest.onerror = function (event) {
                console.log("Error! IndexedDB cannot be used!" + event.target.result);
            };
            openRequest.onsuccess = function (event) {
                console.log("Success! IndexedDB is ready to use!");
                var tspaDatabase = event.target.result;
                tspaDatabase.close();
            };
            openRequest.onupgradeneeded = function (event) {
                console.log("Upgrade is required! Processing...");
                var tspaDatabase = event.target.result;
                var objectStore = tspaDatabase.createObjectStore(this.ProjectsStorageName, { keyPath: "ParentProjectNumber" });
                objectStore.createIndex("WorkingDate", "WorkingDate", { unique: false });
                objectStore.createIndex("ParentProjectNumber", "ParentProjectNumber", { unique: true });
                objectStore.transaction.oncomplete = function (event) {
                    //creation of ProjectsStore completed
                    var ProjectsStore = tspaDatabase
                        .transaction(this.ProjectsStorageName, "readwrite")
                        .objectStore(this.ProjectsStorageName);
                    const projectRep = new ProjectRepository();
                    projectRep.Data.forEach(function (projectData) {
                        console.log("Adding to database " + projectData.ParentProjectNumber);
                        ProjectsStore.add(projectData);
                    });
                    tspaDatabase.close();
                };
                objectStore.transaction.onerror = function (event) {
                    console.log("transaction error");
                    tspaDatabase.close();
                };
            };
        }
        GetFile(parentProjectNumberToSearch, onGetDataCallback) {
            this.GetProject(parentProjectNumberToSearch, (proj) => {
                onGetDataCallback(proj.File);
            });
        }
        GetProject(parentProjectNumberToSearch, onGetDataCallback) {
            console.log("Retrieving data related to project with number: " + parentProjectNumberToSearch);
            Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb) => {
                if (!indexedDb) {
                    console.log("Cannot access indexedDb...");
                    onGetDataCallback(null);
                }
                var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
                openRequest.onsuccess = function (event) {
                    console.log("Connection established to: " + this.DatabaseName);
                    var tspaDatabase = event.target.result;
                    tspaDatabase.transaction(this.ProjectsStorageName)
                        .objectStore(this.ProjectsStorageName)
                        .get(parentProjectNumberToSearch)
                        .onsuccess = function (event) {
                        console.log(" 1 " + event.target.result);
                        onGetDataCallback(event.target.result);
                        tspaDatabase.close();
                    },
                        onerror = function (event) {
                            tspaDatabase.close();
                            console.log("Transaction::Get error.");
                        };
                };
            });
        }
        InsertProject(newProject, onGetDataCallback) {
            Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb) => {
                if (!indexedDb) {
                    console.log("Cannot access indexedDb...");
                    onGetDataCallback(null);
                }
                var openRequest = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
                openRequest.onsuccess = function (event) {
                    var tspaDatabase = event.target.result;
                    tspaDatabase.transaction(this.ProjectsStorageName, "readwrite")
                        .objectStore(this.ProjectsStorageName)
                        .put(newProject)
                        .onsuccess = function (event) {
                        console.log("put suceess");
                        onGetDataCallback(event);
                    },
                        onerror = function (event) {
                            console.log('error storing data !!!!' + event);
                        };
                };
                openRequest.onerror = function (event) {
                    var tspaDatabase = event.target.result;
                    tspaDatabase.close();
                };
            });
        }
        GetMaxNumber(onGetDataCallback) {
            //todo:
            //    Helpers.BrowserComponentGetter.GetIndexedDbComponent((indexedDb: any) =>
            //    {
            //        var openReq = indexedDb.open(this.DatabaseName, this.DatabaseVersion);
            //        openReq.onsuccess = function ()
            //        {
            //            var db = openReq.result;
            //            var transaction = db.transaction(this.ProjectsStorageName, 'readonly');
            //            var objectStore = transaction.objectStore(this.ProjectsStorageName);
            //            var index = objectStore.index('revision');
            //            var openCursorRequest = index.openCursor(null, 'prev');
            //            var maxRevisionObject = null;
            //            openCursorRequest.onsuccess = function (event : any)
            //            {
            //                if (event.target.result)
            //                {
            //                    onGetDataCallback(event.target.result.value); //the object with max revision
            //                }
            //            };
            //        }
            //    });
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
//# sourceMappingURL=DAL.js.map