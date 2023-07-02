
//Array of Entries
const entries = [];

//Start-up function that checks for previous data from Local Storage
function boot() {
    const prevEntries = localStorage.getItem('count');

    //console.log(prevEntries);
    if (prevEntries != 0) {
        for (let i = 0; i < prevEntries; i++) {
            entries.push(JSON.parse(localStorage.getItem('entry' + i)));
            //console.log(entries[i]);
            //console.log("hey");
        }   
    }
    refreshEntries();
}



//Representation of an entry
class Entry {
    title;
    link;
    description;
    //image;
    searched;
    constructor(title, link) {
        this.title = title;
        this.link = link;
        //this.image = image;
        this.description = ""; 
        this.searched = false;
    }
}

//Creates and adds an entry if the inputs are valid
function createEntry() {
    var inputTitle = document.getElementById("userInputTitle").value;
    var inputLink = document.getElementById("userInputLink").value;
    //var inputImage = document.getElementById("userInputImage").value;
    if (inputTitle != "" && inputLink != "" && isValidHttpUrl(inputLink)) {
    //&& inputImage != "" 
        newEntry = new Entry(inputTitle, inputLink);
        entries.push(newEntry);
        refreshEntries();
    }
}

//Refreshes display of entries to what is in the entries array and updates Local Storage save
function refreshEntries() { 
    //console.log("hey");
    var display = document.getElementById("display");
    localStorage.clear();
    let count = 0;
    display.innerHTML = "";
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].searched) {
            display.innerHTML += "<li> <a href=" + entries[i].link + "> <b>" + entries[i].title + "</b> </a>" + entryDescription(i) + "</li>"; 
            //<a href=" + entries[i].image +"> <br>"+  "<span><img src=" + entries[i].image + "alt=" + "image" + " width="+250+" height="+350+" ></span></a>" 
            localStorage.setItem('entry' + i, JSON.stringify(entries[i]));
            count++;
            //console.log(JSON.parse(localStorage.getItem('entry' + i)));  
        }
    }
    for (let i = 0; i < entries.length; i++) {
        if (!entries[i].searched) {
            display.innerHTML += "<li> <a href=" + entries[i].link + "> <b>" + entries[i].title + "</b> </a>" + entryDescription(i) + "</li>"; 
            //<a href=" + entries[i].image +"> <br>"+  "<span><img src=" + entries[i].image + "alt=" + "image" + " width="+250+" height="+350+" ></span></a>" 
            localStorage.setItem('entry' + i, JSON.stringify(entries[i]));
            count++;
            //console.log(JSON.parse(localStorage.getItem('entry' + i)));  
        }
    }
    localStorage.setItem('count', count);
}

//Clears local storage
function clearSave() {
    localStorage.clear();
}

//Produces HTML code to make a corresponding description, update button, and delete button for the given entry
function entryDescription(index) {
    return '<textarea placeholder="Add your notes here." id="entry' + index +  '"name="entry' + index + '">' + entries[index].description + "</textarea>" 
    + '<button onclick="updateDescription(' + index + ')"' + "> Update </button>"
    + '<button onclick="entryDelete(' + index + ')"' + "> Delete </button>";
}

//Updates description of an entry when corresponding update button is pressed
function updateDescription(index) {
    //console.log("hey");
    var updatedDesc = document.getElementById("entry" + index).value;
    entries[index].description = updatedDesc;
    //console.log(index);
    refreshEntries();
}

//Deletes an entry when corresponding delete button is pressed
function entryDelete(index){
    console.log(index);
    var result = confirm("Are you sure you want to delete: " + entries[index].title + "?");
    if (result) {
        if (index == 0) {
            entries.shift();
        } else  {
            entries.splice(index,index);
        }
        localStorage.removeItem("entry" + index);
        var temp = localStorage.getItem("count");
        refreshEntries();
    }

}

//Searches for and flags entries which contain the searched word in either their title or description
function search() {
    var search = document.getElementById("userSearch").value; 
    for (let i = 0; i < entries.length; i++) {
        entries[i].searched = false;
    }   
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].title.toUpperCase().includes(search.toUpperCase())) {
            entries[i].searched = true;
        } else if (entries[i].description.toUpperCase().includes(search.toUpperCase())) {
            entries[i].searched = true;
        }
    } 
    refreshEntries();
}

function clearSearch() {
    for (let i = 0; i < entries.length; i++) {
        entries[i].searched = false;
    }  
    refreshEntries();  
}

//checks if a link is a valid HTTP url
//from: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}