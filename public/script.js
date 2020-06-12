var FIRSTNAME = "";
var USER = "";
var NUMTRACKERS = 0;
var NUMSTUDENTS = 0;
var LAT = 0;
var LONG = 0; 
var BUSARRAY = [];
var LINK = "";

function toggleMap()
{
    var x = document.getElementById("mapDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    document.getElementById("loading").style.display = "none";
}

function toggleMessage()
{
    var x = document.getElementById("message");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    
    document.getElementById("loading").style.display = "none";
}


function getJSON()
{
    //toggleMap();
    //toggleMessage();
    var lat;
    var long;
    const URL = getCookie("link");
    console.log("fetching", URL);
    $.getJSON(URL, function(result){
        console.log(result);
        if(result.hasOwnProperty('because'))
        {
            console.log("Tracking not enabled at this time");
            toggleMessage();
        }
        else
        {
            lat = result.with[0].content.lat;
            long = result.with[0].content.long;
            setLat(lat);
            setLong(long);
            initMap();
            toggleMap();
            
        }
        
    });
}

function setLink(link)
{
    console.log("setting cookie", link)

    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    document.cookie = 
    'link=' + link;
    console.log(decodeURIComponent(document.cookie));
    location.replace("map.html");
}

function viewLocation(busID)
{
    //var id = $(this).closest('tr').find('input[name="pkAdminId"]').val(); 
    setLink("https://dweet.io/get/latest/dweet/for/" + busID);
    
}

function setLat(lat)
{
    LAT = lat;
}

function setLong(long){
    LONG = long;
}

function getLat()
{
    return LAT;
}

function getLong()
{
    return LONG;
}

function openAddStudent()
{
    document.getElementById("studentAdd_form").reset();
    var id;
    var x = document.getElementById("studentAdd");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function openAddTracker()
{
    document.getElementById("addTracker_form").reset();
    var x = document.getElementById("trackerAdd");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function hideAddStudent()
{
    var x = document.getElementById("studentAdd");
    x.style.display = "none";
}

function hideAddTracker()
{
    var x = document.getElementById("trackerAdd");
    x.style.display = "none";
}

async function showStudents()
{
    var email_ = getCookie("email");
    // Find number of students
    await db.collection("administrators").doc(email_).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            NUMSTUDENTS = doc.data().numStudents;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    //console.log(NUMTRACKERS, "trackers for this user");

    // console.log("showing existing", NUMTRACKERS, "tracker IDs")
    // var trackerID_ = document.getElementById("addTracker_form").elements.namedItem("trackerID").value;
     var db_trackerID = "";
     var db_data = "";
     var numStudents = 0;
     var studentArray = []; // 1st ID in index 0
 
    // Find number of IDs in simList to number the tracker IDs (easier to loop through for display later) and add to array
    for(let x=1; x<=NUMSTUDENTS; x++)
        {
             await db.collection("administrators").doc(email_).collection("studentList").where("num", "==", x)
             .get()
             .then(function(querySnapshot) {
                 querySnapshot.forEach(function(doc) {
                     console.log("retrieved from firebase");
                     console.log(doc.id, " => ", doc.data());
                     studentArray.push(doc.data());
                     console.log("studentArray", numStudents, studentArray[numStudents]);
                     numStudents++;
                     console.log("num: ", numStudents);
                     
                    var table = document.getElementById("studentTable");
                    var row = table.insertRow(x);
                    var num_cell = row.insertCell(0);
                    var studentID_cell = row.insertCell(1);
                    var first_cell = row.insertCell(2);
                    var last_cell = row.insertCell(3);
                    var route_cell = row.insertCell(4);
                    var bus_cell = row.insertCell(5);
                   
                    let temp = studentArray[numStudents - 1];
                    console.log("temp", temp);
                    num_cell.innerHTML = temp.num;
                    studentID_cell.innerHTML = temp.studentID;
                    first_cell.innerHTML = temp.first;
                    last_cell.innerHTML = temp.last;
                    route_cell.innerHTML = temp.routeID;
                    bus_cell.innerHTML = temp.trackerID;

                    var viewButton = row.insertCell(6);
                    arg = temp.first + " " + temp.last;
                    viewButton.innerHTML = '<input type="button" value="View Bus Pass" onclick="setName(\''+ arg + '\'); setRouteID(\''+ temp.routeID + '\'); setBusID(\''+ temp.trackerID + '\'); loadBusPass('+ temp.studentID + ');" >';
                    
                    var deleteButton = row.insertCell(7);
                    deleteButton.innerHTML = '<input type="button" value="Delete" onclick=deleteStudent(' + temp.num + ')>'
                 });
             })
             .catch(function(error) {
                 console.log("Error getting documents: ", error);
             });
        }
}

function setName(name)
{
    console.log("set name");
    document.cookie = 'studentName=' + name;
}

function setRouteID(route)
{
    console.log("set route");
    document.cookie = 'route=' + route;
}

function setBusID(tracker)
{
    console.log("set tracker");
    document.cookie = 'tracker=' + tracker;
}

function loadBusPass(studentID)
{
    //studentID, firstname, lastname, routeID, busID)
    var opened = window.open("");
    opened.document.write("<html><head><title>Bus Pass</title></head><body style='padding: 30px'><h1>Bus Pass</h1><img src='myBusLogo.png'><p>" + getCookie("studentName") + "<br><br>Student ID: " + studentID + "<br>Bus ID: " + getCookie("tracker") + "<br>Route ID: " + getCookie("route") +  "<br><br>Your schoolbus can now be tracked using the myBus app found on the App Store. <br> Be sure to create an account using the information provided above and a valid email address. <br> Log in to the app to locate your bus and receive alerts!</p></body></html>");
}

async function addStudent()
{
    // specify where this input is from later
    var trackerID_ = document.getElementById("studentAdd_form").elements.namedItem("trackerID").value;
    var firstname_ = document.getElementById("studentAdd_form").elements.namedItem("firstname").value;
    var lastname_ = document.getElementById("studentAdd_form").elements.namedItem("lastname").value;
    var routeID_ = document.getElementById("studentAdd_form").elements.namedItem("routeID").value;
    var studentID_ = document.getElementById("studentAdd_form").elements.namedItem("studentID").value;
    var db_trackerID = "";
    var db_studentID = "";
    var db_data = "";
    var studentArray = []; // 1st ID in index 0
    openAddStudent();
    var email_ = getCookie("email");

    // console.log(email_, trackerID_, "total before adding: ", NUMTRACKERS)

    // Check if bus ID is in database
    await db.collection("administrators").doc(email_).collection("simList").where("trackerID", "==", trackerID_)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log("retrieved from firebase")
            console.log(doc.id, " => ", doc.data());
            db_trackerID = doc.data().trackerID;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    // Check if student is in database
    await db.collection("administrators").doc(email_).collection("studentList").where("studentID", "==", studentID_)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log("retrieved from firebase")
            console.log(doc.id, " => ", doc.data());
            db_studentID = doc.data().trackerID;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    // Check if ID already in database
    if(db_trackerID == "")
    {
        alert("This bus ID is not registered in your account");
        return;
    }
    if(db_studentID != "")
    {
        alert("This student has already been registered in your account");
        return;
    }
    else if(firstname_ == "")
    {
        alert("Please enter first name of student.");
        return;
    }
    else if(lastname_ == "")
    {
        alert("Please enter last name of student.");
        return;
    }
    else if(routeID_ == "")
    {
        alert("Please enter route ID of student");
        return;
    }
    else if(trackerID_ == "")
    {
        alert("Please enter bus tracker ID of student");
        return;
    }
    // Add to database
    else
    {
        // Add a new document in subcollection "studentList" in "administrators"
        NUMSTUDENTS++;
        tempNumStudents = NUMSTUDENTS.toString();
        //console.log("email, num: ", email_, tempNumIDs);
        await db.collection("administrators").doc(email_).collection("studentList").doc(studentID_).set({
            first: firstname_,
            last: lastname_,
            routeID: routeID_,
            trackerID: trackerID_,
            studentID: studentID_,
            num: NUMSTUDENTS
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        await db.collection("students").doc(studentID_).set({
            first: firstname_,
            last: lastname_,
            routeID: routeID_,
            trackerID: trackerID_,
            studentID: studentID_,
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        // Update number of trackers user has
        const db_ = firebase.firestore();
        const increment = firebase.firestore.FieldValue.increment(1);

        // Document reference
        const adminRef = db_.collection("administrators").doc(email_);

        // Update read count
        adminRef.update({ numStudents: increment });
        
        // Add new student to array
        await db.collection("administrators").doc(email_).collection("studentList").where("num", "==", NUMSTUDENTS)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log("retrieved from firebase");
                    console.log(doc.id, " => ", doc.data());

                    var table = document.getElementById("studentTable");
                    var row = table.insertRow(NUMSTUDENTS);
                    var num_cell = row.insertCell(0);
                    var studentID_cell = row.insertCell(1);
                    var first_cell = row.insertCell(2);
                    var last_cell = row.insertCell(3);
                    var route_cell = row.insertCell(4);
                    var bus_cell = row.insertCell(5);
                    num_cell.innerHTML = doc.data().num;
                    studentID_cell.innerHTML = doc.data().studentID;
                    first_cell.innerHTML = doc.data().first;
                    last_cell.innerHTML = doc.data().last;
                    route_cell.innerHTML = doc.data().routeID;
                    bus_cell.innerHTML = doc.data().trackerID;
                    var viewButton = row.insertCell(6);
                    arg = doc.data().first + " " + doc.data().last;
                    viewButton.innerHTML = '<input type="button" value="View Bus Pass" onclick="setName(\''+ arg + '\'); setRouteID(\''+ doc.data().routeID + '\'); setBusID(\''+ doc.data().trackerID + '\'); loadBusPass('+ doc.data().studentID + ');" >';
                    
                    var deleteButton = row.insertCell(7);
                    deleteButton.innerHTML = '<input type="button" value="Delete" onclick=deleteStudent(' + doc.data().num + ')>'
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
}

function deleteStudent(num)
{
    console.log("deleting ", num, getCookie("email"));
    NUMSTUDENTS--;

    // Delete from studentList
    
    var sID = document.getElementById("studentTable").rows[num].cells.item(1).innerHTML;
    var sList = db.collection('students').where('studentID','==',sID);

    sList.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        doc.ref.delete();
        console.log("deleted", sID);
    
        //location.replace("editStudent.html")
        
        });
    });



    // Delete from admin studentList
    var jobskill_query = db.collection('administrators').doc(getCookie("email")).collection('studentList').where('num','==',num);
    document.getElementById("studentTable").deleteRow(num); 

    jobskill_query.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        doc.ref.delete();
        console.log("deleted");
    
        //location.replace("editStudent.html")
        
        });
    });

    


    db.collection("administrators").doc(getCookie("email")).update({ 
        "numStudents": NUMSTUDENTS
    })
    .then(function() {
        console.log("here");

        

        for(var i = num; i< NUMSTUDENTS + 1; i++ )
        {
            
            id = document.getElementById("studentTable").rows[i].cells.item(1).innerHTML;
            console.log("id: ", id);
            const db_ = firebase.firestore();
            const increment = firebase.firestore.FieldValue.increment(-1);

            // Document reference
            const ref = db_.collection("administrators").doc(getCookie("email")).collection("studentList").doc(id);

            // Update read count
            ref.update({ "num" : increment });
        }
   
        console.log("Document successfully updated!");

    });

    /*
    db.collection("administrators").doc(getCookie("email")).collection("studentList").doc(toString(10)).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    */
    
}

async function showTrackers()
{
    var email_ = getCookie("email");
    await db.collection("administrators").doc(email_).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            NUMTRACKERS = doc.data().numTrackers;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    console.log(NUMTRACKERS, "trackers for this user");

    console.log("showing existing", NUMTRACKERS, "tracker IDs")
     // specify where this input is from later
     var trackerID_ = document.getElementById("addTracker_form").elements.namedItem("trackerID").value;
     var db_trackerID = "";
     var db_data = "";
     var numIDs = 0;
     var idArray = []; // 1st ID in index 0
 
    // Find number of IDs in simList to number the tracker IDs (easier to loop through for display later) and add to array
    for(let x=1; x<=NUMTRACKERS; x++)
        {
             await db.collection("administrators").doc(email_).collection("simList").where("num", "==", x)
             .get()
             .then(function(querySnapshot) {
                 querySnapshot.forEach(function(doc) {
                     console.log("retrieved from firebase");
                     console.log(doc.id, " => ", doc.data());
                     idArray.push(doc.data());
                     console.log("idArray", numIDs, idArray[numIDs]);
                     numIDs++;
                     console.log("num: ", numIDs);

                     var table = document.getElementById("trackerTable");
                     var row = table.insertRow(x);
                     var num_cell = row.insertCell(0);
                     var id_cell = row.insertCell(1);
                     var blank1 = row.insertCell(2);
                     var blank2 = row.insertCell(3);
                      

                     let temp = idArray[numIDs-1];
                     BUSARRAY = idArray[numIDs-1];
                     console.log("temp", temp);
                     num_cell.innerHTML = temp.num;
                     id_cell.innerHTML = temp.trackerID;
                     blank1.innerHTML = "                                                                        ";
                     blank2.innerHTML = "                                                                        ";
                     var viewButton = row.insertCell(4);
                     viewButton.innerHTML = '<input type="button" value="View Location" onclick=viewLocation(' + temp.trackerID + ')>'; 
                 });
             })
             .catch(function(error) {
                 console.log("Error getting documents: ", error);
             });
        }
}

async function addTracker()
{
    // specify where this input is from later
    var trackerID_ = document.getElementById("addTracker_form").elements.namedItem("trackerID").value;
    var db_trackerID = "";
    var db_data = "";
    var numIDs = NUMTRACKERS;
    var idArray = []; // 1st ID in index 0
    openAddTracker();
    var email_ = getCookie("email");

    console.log(email_, trackerID_, "total before adding: ", NUMTRACKERS)

    // Check if ID is already in database
    await db.collection("administrators").doc(email_).collection("simList").where("trackerID", "==", trackerID_)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log("retrieved from firebase")
            console.log(doc.id, " => ", doc.data());
            db_trackerID = doc.data().trackerID;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    // Check if ID already in database
    if(db_trackerID != "")
    {
        alert("This tracker ID has already been added to your database.");
        return;
    }
    // Add to database
    else
    {
        // Add a new document in collection "administrators"
        numIDs++;
        NUMTRACKERS++;
        tempNumIDs = numIDs.toString();
        console.log("email, num: ", email_, tempNumIDs);
        await db.collection("administrators").doc(email_).collection("simList").doc(tempNumIDs).set({
            trackerID: trackerID_,
            num: numIDs
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        // Update number of trackers user has
        const db_ = firebase.firestore();
        const increment = firebase.firestore.FieldValue.increment(1);

        // Document reference
        const adminRef = db_.collection("administrators").doc(email_);

        // Update read count
        adminRef.update({ numTrackers: increment });
        
        // Add new trackerID to array
        await db.collection("administrators").doc(email_).collection("simList").where("num", "==", numIDs)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log("retrieved from firebase");
                    console.log(doc.id, " => ", doc.data());

                    var table = document.getElementById("trackerTable");
                    var row = table.insertRow(NUMTRACKERS);
                    var num_cell = row.insertCell(0);
                    var id_cell = row.insertCell(1);
                    var blank1 = row.insertCell(2);
                    var blank2 = row.insertCell(3);

                    num_cell.innerHTML = doc.data().num;
                    id_cell.innerHTML = doc.data().trackerID;
                    blank1.innerHTML = "                                                                        ";
                    blank2.innerHTML = "                                                                        ";
                    var viewButton = row.insertCell(4);
                    viewButton.innerHTML = '<input type="button" value="View Location" onclick=viewLocation(' + doc.data().trackerID + ')>';
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
}

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD6QRc5G87UGaejrquWZYpKSjHfDjn9zbs",
    authDomain: "mybus-99b9a.firebaseapp.com",
    databaseURL: "https://mybus-99b9a.firebaseio.com",
    projectId: "mybus-99b9a",
    storageBucket: "mybus-99b9a.appspot.com",
    messagingSenderId: "156236431320",
    appId: "1:156236431320:web:e4d26d3b59425f7fab7cad",
    measurementId: "G-Q0VGJGPHGZ"
};
  
  /***
  const firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");
  **/

 // Initialize Firebase
firebase.initializeApp(firebaseConfig);
 firebase.analytics();
  
var db = firebase.firestore();

async function signup()
{
    console.log("signing up")
    var email_ = document.getElementById("signup_form").elements.namedItem("email").value;
    var firstname_ = document.getElementById("signup_form").elements.namedItem("firstname").value;
    var lastname_ = document.getElementById("signup_form").elements.namedItem("lastname").value;
    var password_ = document.getElementById("signup_form").elements.namedItem("password").value;
    var password2_ = document.getElementById("signup_form").elements.namedItem("password_retype").value;
    var db_email = "";

    // Check if email already in database
    await db.collection("administrators").where("email", "==", email_)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log("retrieved from firebase")
            console.log(doc.id, " => ", doc.data());
            db_email = doc.id;
            //let db_data = JSON.parse(doc.data());
            //db_email = db_data.email;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    if(db_email != "")
    {
        alert("An existing user is already using this email.");
        return;
    }
    // Check if passwords match
    else if (password_ != password2_)
    {
        alert("Passwords do not match.");
        return;
    }
    // Check if password is long enough
    else if (password_ < 6)
    {
        alert("Password must be at least 6 characters long.");
        return;
    }
    // Add to database
    else
    {
        // Add a new document in collection "administrators"
        await db.collection("administrators").doc(email_).set({
            account_type: "Bus Company",
            email: email_,
            first_name: firstname_,
            last_name: lastname_,
            password: password_,
            numTrackers: 0,
            numStudents: 0
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        // Add a new subcollection to new admin user for bus IDs
        await db.collection("administrators").doc(email_).collection("simList").add({
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        //Add a new subcollection to new admin user for students
        await db.collection("administrators").doc(email_).collection("studentList").add({
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        setcookie(email_);
        location.replace("home.html");        
    } 
}

async function signin()
{
    console.log("signing in")
    var email_ = document.getElementById("signin_form").elements.namedItem("email").value;
    var password_ = document.getElementById("signin_form").elements.namedItem("password").value;
    var db_email = "";
    var db_password = "";
    var db_data;
    await db.collection("administrators").where("email", "==", email_).where("password", "==", password_)
       .get()
       .then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               console.log("retrieved from firebase")
               console.log(doc.id, " => ", doc.data());
               db_email = doc.id;
           });
       })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    if(db_email == "")
    {
        console.log("email not in database or incorrect password")
        alert(email_ + " is not a valid user or the password is incorrect.");
    }
    else
    {
        console.log("signing in")
        setcookie(email_);
        location.replace("home.html");
        //home_greeting();
    }
}

async function home_greeting()
{
    setNumTrackers();
    var email_ = getCookie("email");
    await db.collection("administrators").where("email", "==", email_)
       .get()
       .then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               console.log("home_greeting retrieved from firebase")
               console.log(doc.id, " => ", doc.data());
               //console.log("db_data: " + DATA);
               FIRSTNAME = doc.data().first_name;
               var greeting = "Welcome " + FIRSTNAME + " to your myBus admin account! Thank you for choosing myBus!";
               document.getElementById("greeting").innerHTML = greeting;
           });
       })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    return; 
}

// Set a username cookie using email
function setcookie(email_)
{
    console.log("setting cookie")

    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    document.cookie = 
    'email=' + email_ + 
    '; expires=' + now.toUTCString() + 
    '; path=/';

    USER = email_;
}

// Set number of Trackers
async function setNumTrackers()
{
    var email_ = getCookie("email");
    await db.collection("administrators").doc(email_).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            NUMTRACKERS = doc.data().numTrackers;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    console.log(NUMTRACKERS, "trackers for this user");
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        //console.log(c.substring(name.length, c.length));
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function to_signup()
{
    location.replace("signup.html");
}

function to_login()
{
    location.replace("index.html");
}

