var plcConnected = false;

async function changeIP() {
    let newIP = document.getElementById("EnterIP").value;
    await window.electronAPI.setIpAddress(newIP);
    document.getElementById("StatusIP").innerHTML = `PLC IP Address is: "${newIP}"`;
}

async function connect() {
    let status = document.getElementById("StatusPlcConnection");
    status.innerHTML = "Loading";
    status.classList = "";

    let result = await window.electronAPI.connectPlc();
    plcConnected = result == true;
    if (result == true) {
        status.classList = "success";
        status.innerHTML = "Connected!";
    }
    else {
        status.classList = "error";
        result = result.toString();
        if (result.includes("TIMEOUT")) {
            status.innerHTML = "Timeout when connecting, please check: <br />-IP Address is correct. <br />-Ethernet Cable is connected."
        }
    }
}

async function readTag() {
    let status = document.getElementById("StatusReadTag");
    if (!plcConnected) {
        status.innerHTML = "Error: Please Connect to PLC First!";
        return;
    }
    let tagToBeRead = document.getElementById("ReadEnterTag").value;
    let result = await window.electronAPI.readPlc(tagToBeRead);
    status.innerHTML = `Result = ${result}`;
}