(function () {
    var state = null;

    var resetApp = function () {
        state = JSON.parse(localStorage.getItem('encryption-state')) || {
                messages: {}
            };
        console.log("asdf", localStorage.getItem('encryption-state'));
        document.getElementById("flash-message").style.visibility = 'hidden';
        updateUi();
    };

    var saveState = function () {
        localStorage.setItem('encryption-state', JSON.stringify(state));
    };

    var updateUi = function (flashMessage) {
        console.log("state: ", state);
        if (Object.keys(state.messages).length) {
            document.getElementById("backlog").style.visibility = '';
            document.getElementById("unsent-messages-count").innerText = Object.keys(state.messages).length;
            var list = "";
            for (var timestamp in state.messages) {
                list += "<li>" + timestamp + ": <input value='" + state.messages[timestamp] + "' class='pgp-message'></li>";
            }
            document.getElementById("unsent-message-list").innerHTML = list;
        } else {
            document.getElementById("backlog").style.visibility = 'hidden';
        }
        if (flashMessage) {
            document.getElementById("flash-message").innerHTML = flashMessage;
            document.getElementById("flash-message").style.visibility = '';
            window.setTimeout(function () {
                document.getElementById("flash-message").style.visibility = 'hidden';
            }, 5000);
        } else {
            document.getElementById("flash-message").style.visibility = 'hidden';
        }
    };

    var sync = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "backend.php", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0) {
                    updateUi("<strong>Offline?</strong> Sync failed.");
                } else if (xhr.status === 200) {
                    console.log("success");
                    var saved_timestamps = JSON.parse(xhr.responseText);
                    // to use splice the array must be iterated in reverse order.
                    for (var i = 0; i < saved_timestamps.length; i++) {
                        var timestamp = saved_timestamps[i];
                        delete state.messages[timestamp];
                    }
                    saveState();
                    updateUi("<strong>OK!</strong> Messages saved and synced.");
                } else {
                    console.log("error", xhr);
                    updateUi("<strong>Error while syncing!</strong> Sync did not succeed. Status=" + xhr.status);
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
                // console.log(ciphertext.data);
                state.messages[new Date().getTime()] = ciphertext.data;
                saveState();
                document.getElementById("plain-message").value = "";
                updateUi("Saved");
                sync();
            }
        ).catch(function (error) {
            console.log('Failed: ' + error);
        });
    };


    document.getElementById("sync-button").onclick = sync;

//     var now = new Date().getTime();
//     if (state.lastBeat) {
//         var diff = now - state.lastPressedBeat;
//         // if we missed more than 1 beat, measure since last beat
//         if (diff > state.interval * 2) {
//             diff = now - state.lastBeat;
//             // if the difference is small, measure since previous beat
//             // if we hit just after the beat, we have to increase the interval (instead of setting a very short one)
//             if (diff < state.interval / 3) {
//                 diff += state.interval;
//             }
//         }
//         state.diffs.push(diff);
//
//         // remove oldest samples:
//         if (state.diffs.length > MAX_SAMPLES) {
//             state.diffs.splice(0, state.diffs.length - MAX_SAMPLES);
//         }
//
//         var sumOfDiffs = state.diffs.reduce(function (v1, v2) {
//             return v1 + v2;
//         }, 0);
//
//         // average:
//         state.interval = sumOfDiffs / state.diffs.length;
//         var intervalSeconds = state.interval / 1000;
//         ;
//         ;
//         ;
//         ;
//         ;
//         ;
//         ;
//         ;
//         ;
//         document.getElementById("interval").textContent = Math.round(intervalSeconds * 100) / 100 + "s";
//
//         playBeat();
//         clearInterval(beatTimer);
//         beatTimer = setInterval(playBeat, state.interval);
//
//         document.getElementById("playDetails").style.visibility = 'visible';
//         document.getElementById("pressAgainHint").style.visibility = 'hidden';
//     } else {
//         document.getElementById("pressAgainHint").style.visibility = 'visible';
//     }
//
//     console.log(state.diffs);
//
//     state.lastBeat = now;
//     state.lastPressedBeat = now;
// };


// Update UI with 25fps
//     setInterval(function () {
//         var timeSinceLastBeat = new Date().getTime() - state.lastBeat;
//         var progressPercent = 100.0 / state.interval * timeSinceLastBeat;
//
//         document.getElementById("progress-bar").style.width = progressPercent + "%";
//     }, 1000 / 25);

    resetApp();

})
();