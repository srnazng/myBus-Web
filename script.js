function openAdd()
{
    var x = document.getElementById("userAdd");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function hideAdd()
{
    document.getElementById("userAdd").style.visibility = "hidden";
    document.getElementById("myDIV").style.display = "none";

    var x = document.getElementById("userAdd");
    x.style.display = "none";
}

function addStudent()
{
    var table = document.getElementById("studentTable");
    var row = table.insertRow(1);
    var firstname_cell = row.insertCell(0);
    var lastname_cell = row.insertCell(1);
    var school_cell = row.insertCell(2);
    var busid_cell = row.insertCell(3);
    var routeid_cell = row.insertCell(4);
    var address_cell = row.insertCell(5);
    var pickup_cell = row.insertCell(6);
    var dropoff_cell = row.insertCell(7);
    firstname_cell.innerHTML = "NEW CELL1";
    lastname_cell.innerHTML = "NEW CELL2";
}