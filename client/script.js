/** ELEMENTS */
const addFileButton = () => {
    return document.getElementById("add-button")
}

const addVersionButton = () => {
    return document.getElementById("add-version-button")
}

const addFileForm = () => {
    return document.getElementById("add-file-form")
}

const fileList = () => {
    return document.getElementById("file-list-div")
}

const fileTable = () => {
    return document.getElementById('file-list');
}

const versionsList = () => {
    return document.getElementById("version-list-div")
}

const versionsTable = () => {
    return document.getElementById("version-list")
}

const fileTitle = () => {
    return document.getElementById("file-title")
}

const fileDescription = () => {
    return document.getElementById("file-description")
}

/** PAGE FUNCTIONS */
const clearAddForm = () => {
    document.getElementById('add-name').value = ""
    document.getElementById('add-desc').value = ""
    document.getElementById('add-link').value = ""
}

const clearVersionForm = () => {
    document.getElementById('add-version-desc').value = ""
    document.getElementById('add-version-link').value = ""
}

const clearFileList = (tableRef) => {
    //let tableRef = fileTable();
    var tableRows = tableRef.rows;
    var length = tableRows.length
    console.log("tableRows.length:", tableRows.length)

    for (var i = length-1; i > 0; i--) {
        console.log("removing row:", i)
        tableRef.deleteRow(i)
    }
}

const hideVersionsList = () => {
    versionsList().classList.add("hidden")
    // addFileForm().classList.add("hidden")
}

const showVersionsList = () => {
    versionsList().classList.remove("hidden")
}

const hideFileList = () => {
    fileList().classList.add("hidden")
}

const showFileList = () => {
    fileList().classList.remove("hidden")
}

const listVersions = (fileId) => {
    console.log("List versions with id:", fileId)
    hideFileList()
    showVersionsList()
    initVersionList(fileId)
    document.getElementById("add-version-file-id").value = fileId
}

const backToFiles = () => {
    hideVersionsList()
    clearVersionForm()
    showFileList()
    initFileList()
}

/** DATA FUNCTIONS */
const initFileList = () => {
    axios.get('http://localhost:8765/api/allFiles').then((res) => {
        let tableRef = fileTable();
        clearFileList(tableRef)
        hideVersionsList()
        // console.log(res.data)
        for(let i=0; i < res.data.length; i++){
            // Insert a row at the end of the table
            let newRow = tableRef.insertRow(-1);

            let editCell = newRow.insertCell(0)
            var editLink = document.createElement("button")
            editLink.setAttribute("onClick", `listVersions(${res.data[i].id})`)
            var editLinkText = document.createTextNode("Versions")
            editLink.appendChild(editLinkText)
            editCell.appendChild(editLink)


            // Insert a cell in the row at index 0
            let linkCell = newRow.insertCell(0);
            // Append a text node to the cell
            var link = document.createElement("a");
            link.setAttribute("href", res.data[i].link)
            //TODO add a class for the link
            //link.className = "someCSSclass";
            
            var linkText = document.createTextNode("Link");
            link.appendChild(linkText);

            // Add the link to the previously created TableCell.
            linkCell.appendChild(link);



            //linkCell.appendChild(document.createTextNode(res.data[i].link));

            let descCell = newRow.insertCell(0);
            descCell.appendChild(document.createTextNode(res.data[i].description));

            let nameCell = newRow.insertCell(0);
            nameCell.appendChild(document.createTextNode(res.data[i].name));
            
            // document.querySelector('body').appendChild(newItem)
        }
    })
}

const initVersionList = (fileId) => {

    axios.get('http://localhost:8765/api/versions/'+fileId).then((res) => {
        fileTitle().innerHTML = res.data.file.name
        fileDescription().innerHTML = res.data.file.description

        let tableRef = versionsTable();
        clearFileList(tableRef)
        showVersionsList()
        console.log(res.data)
        //version, timestamp, comment, link
        for(let i=0; i < res.data.versions.length; i++){
            // Insert a row at the end of the table
            let newRow = tableRef.insertRow(-1);

            // Insert a cell in the row at index 0
            let linkCell = newRow.insertCell(0);
            // Append a text node to the cell
            var link = document.createElement("a");
            link.setAttribute("href", res.data.versions[i].link)
            //TODO add a class for the link
            //link.className = "someCSSclass";
            
            var linkText = document.createTextNode("Link");
            link.appendChild(linkText);

            // Add the link to the previously created TableCell.
            linkCell.appendChild(link);

            let commentCell = newRow.insertCell(0);
            commentCell.appendChild(document.createTextNode(res.data.versions[i].comment));

            var local = new Date(res.data.versions[i].date_created);
            var offset = local.getTimezoneOffset();
            var utc = new Date(local.getTime() - offset * 60000);
            let tsCell = newRow.insertCell(0);
            tsCell.appendChild(document.createTextNode(utc.toLocaleString()));

            let versionCell = newRow.insertCell(0);
            versionCell.appendChild(document.createTextNode(res.data.versions[i].version));
            
            // document.querySelector('body').appendChild(newItem)
        }
    })
}

const addFile = (evt) => {
    evt.preventDefault()
    const name = document.getElementById('add-name').value
    const description = document.getElementById('add-desc').value
    const link = document.getElementById('add-link').value

    const body = {name: name, description: description, link: link}
    console.log("sending body:", body)

    axios.post('http://localhost:8765/api/addFile', body).then((res) => {
        console.log(res.data)
        if(res.data.success){
            console.log("clear form and refresh file list")
            clearAddForm()
            initFileList()
        }
    })   
}

const addVersion = (evt) => {
    evt.preventDefault()
    const fileId = document.getElementById('add-version-file-id').value
    const comment = document.getElementById('add-version-desc').value
    const link = document.getElementById('add-version-link').value

    const body = {fileId: fileId, comment: comment, link: link}
    console.log("sending body:", body)

    axios.post('http://localhost:8765/api/addVersion', body).then((res) => {
        console.log(res.data)
        if(res.data.success){
            console.log("clear form and refresh version list")
            clearVersionForm()
            initVersionList(fileId)
        }
    })   
}

/** LISTENERS */
addFileButton().addEventListener('click', addFile)
addVersionButton().addEventListener('click', addVersion)

/** INIT PAGE */

initFileList()
showFileList()