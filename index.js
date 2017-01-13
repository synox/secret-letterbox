(function () {
    // Init
    var state = JSON.parse(localStorage.getItem('encryption-state')) || {
            messages: {}
        };
    var flashMessageTimeout = null;

    var saveState = function () {
        localStorage.setItem('encryption-state', JSON.stringify(state));
    };

    var flashMessage = function (text) {
        clearTimeout(flashMessageTimeout);
        var element = document.getElementById("flash-message");
        if (text) {
            element.innerHTML = text;
            element.style.display = '';
            flashMessageTimeout = window.setTimeout(function () {
                element.style.display = 'none';
            }, 5000);
        } else {
            element.style.display = 'none';
        }
    };

    var updateUi = function () {
        if (Object.keys(state.messages).length) {
            document.getElementById("backlog").style.display = '';
            document.getElementById("unsent-messages-count").innerText = Object.keys(state.messages).length;
            var tableHtml = "";
            for (var timestamp in state.messages) {
                tableHtml += "<tr><td>" + timestamp + "</td><td><input value='" + state.messages[timestamp] + "'></td></tr>";
            }
            document.getElementById("unsent-message-list").innerHTML = tableHtml;
        } else {
            document.getElementById("backlog").style.display = 'none';
        }
    };

    var runSync = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "backend.php", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var saved_timestamps = JSON.parse(xhr.responseText);
                    for (var i = 0; i < saved_timestamps.length; i++) {
                        var timestamp = saved_timestamps[i];
                        delete state.messages[timestamp];
                    }
                    saveState();
                    updateUi();
                    flashMessage("<strong>OK!</strong> Messages saved and synced.");
                } else if (xhr.status === 0) {
                    flashMessage("<strong>Offline?</strong> Sync failed.");
                } else {
                    console.log("error", xhr);
                    updateUi();
                    flashMessage("<strong>Error while syncing!</strong> Sync did not succeed. Status=" + xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify(state.messages));
    };

    document.getElementById("save-button").onclick = function (event) {
        var options = {
            data: document.getElementById("plain-message").value,
            publicKeys: openpgp.key.readArmored(pub_key).keys
        };
        openpgp.encrypt(options).then(function (ciphertext) {
                state.messages[new Date().getTime()] = ciphertext.data;
                saveState();
                document.getElementById("plain-message").value = "";
            updateUi();
            flashMessage("Saved.");
            runSync();
            }
        ).catch(function (error) {
            console.log('Failed: ' + error);
        });
    };

    document.getElementById("sync-button").onclick = runSync;
    updateUi();

})();