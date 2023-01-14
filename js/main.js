var list = [
    {"desc":"rice","amount":"1","value":"5.40"},
    {"desc":"beer","amount":"12","value":"1.99"},
    {"desc":"meat","amount":"1","value":"15.00"}
];

function getTotal(list) {
    var total = 0;
    for (var key in list) {
        total += list[key].value * list[key].amount;
    }
    document.getElementById("totalValue").innerHTML = formatValue(total);
    return total;
}

function setList(list) {
    var table = '<thead><tr><th>Description</th><th>Amount</th><th>Value</th><th>Action</th></tr></thead><tbody>';

    for (var key in list) {
        table += '<tr><td>'+ formatDesc( list[key].desc ) +'</td><td>'+ formatAnount( list[key].amount ) +'</td><td>'+ formatValue( list[key].value ) +'</td><td> <button type="button" class="btn btn-primary" onclick="setUpdate('+key+')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteData('+key+')"> Delete </button> </td></tr>';
    }

    table += '</tbody>';

    document.getElementById("listTable").innerHTML = table;
    
    // Computa o valor total
    getTotal(list);

    // Gravando localmente
    saveListStorage(list);
}

function formatDesc(desc) {
    var str = desc.toLowerCase();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
}

function formatAnount(amount) {
    return parseInt(amount);
}

function formatValue(value) {
    var str = parseFloat(value).toFixed(2) + "";
    str = str.replace('.', ',');
    str = "R$ "+str; 
    return str;
}

function addData() {
    if (!validation()) {
        return;
    }
    var desc = document.getElementById("desc").value;
    var amount = document.getElementById("amount").value;
    var value = document.getElementById("value").value;

    list.unshift({"desc":desc,"amount":amount,"value":value});
    resetForm();
    setList(list);
}

function setUpdate(id) {
    var obj = list[id];
    document.getElementById("desc").value = obj.desc;
    document.getElementById("amount").value = obj.amount;
    document.getElementById("value").value = obj.value;
    document.getElementById("btnUpdate").style.display = "inline-block";
    document.getElementById("btnAdd").style.display = "none";
    document.getElementById("idUpdate").value = id;
}

function resetForm() {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("value").value = "";
    document.getElementById("btnUpdate").style.display = "none";
    document.getElementById("btnAdd").style.display = "inline-block";
    document.getElementById("idUpdate").value = null;
    // document.getElementById("errors").style.display = "none";

    document.getElementById("desc").focus();
}

function updateData() {
    if (!validation()) {
        return;
    }
    var id = document.getElementById("idUpdate").value;
    var desc = document.getElementById("desc").value;
    var amount = document.getElementById("amount").value;
    var value = document.getElementById("value").value;

    list[id] = {"desc":desc,"amount":amount,"value":value};
    resetForm();
    setList(list); 
}

function deleteData(id) {
    if (confirm("Delete this item?")) {
        if (id === list.length -1) {
            list.pop();
        } else if (id === 0) {
            list.shift();
        } else {
            var listAuxIni = list.slice(0, id);
            var listAuxFin = list.slice(id + 1);
            list = listAuxIni.concat(listAuxFin);
        }
    }
    setList(list);
}

function validation() {
    var desc = document.getElementById("desc").value;
    var amount = document.getElementById("amount").value;
    var value = document.getElementById("value").value;
    var errors = "";

    document.getElementById("errors").style.display = "none";

    if (desc === "") {
        errors += "<p>Fill out description.</p>";
    }
    if (amount === "") {
        errors += "<p>Fill out amount.</p>";
    } else if (amount != parseInt(amount)) {
        errors += "<p>Fill out a valid amount.</p>";
    }
    if (value === "") {
        errors += "<p>Fill out value.</p>";
    } else if (value != parseFloat(value)) {
        errors += "<p>Fill out a valid value.</p>";
    }

    if (errors != "") {
        document.getElementById("errors").innerHTML = "<h3>Error:</h3>" + errors;
        document.getElementById("errors").style.display = "block";
        return 0;
    } else {
        return 1;
    }
}

function deleteList() {
    if(confirm("Delete this list?")) {
        list = [];
        setList(list);
    }
}

function saveListStorage(list) {
    var jsonStr = JSON.stringify(list);

    localStorage.setItem("scList", jsonStr);
}

function initListStorage() {
    var testList = localStorage.getItem("scList");
    
    if (testList) {
        list = JSON.parse(testList);
    }

    setList(list);
}