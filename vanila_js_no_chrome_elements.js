
"use strict";

// ============================================================
// VANILLA JS STORAGE COMPATIBILITY LAYER
// Replaces chrome.storage.local
// ============================================================

const browserStorage = {
  get(callback) {
    const defaults = {
      posted: false,
      locked: true,
      score: 0,
      finds: {
        malaria: null,
        devil: null,
        napalm: null,
        blue_bus: null,
        surf: null,
        chef_head: null
      }
    };

    let stored = {};

    try {
      stored = JSON.parse(localStorage.getItem("gameState") || "{}");
    } catch (error) {
      console.error("Could not read saved game state:", error);
    }

    const state = {
      ...defaults,
      ...stored,
      finds: {
        ...defaults.finds,
        ...(stored.finds || {})
      }
    };

    callback(state);
  },

  set(state, callback = () => {}) {
    try {
      const current = JSON.parse(localStorage.getItem("gameState") || "{}");

      localStorage.setItem(
        "gameState",
        JSON.stringify({ ...current, ...state })
      );

      callback();
    } catch (error) {
      console.error("Could not save game state:", error);
    }
  }
};


// ============================================================
// RESPONSIVE SIDEBARS
// ============================================================

const left_panel_close = document.querySelector("#left_panel_close");
const right_panel_close = document.querySelector("#right_panel_close");
const folded_left_panel = document.querySelector("#folded_left_panel");
const folded_right_panel = document.querySelector("#folded_right_panel");
const right_panel_unfolded = document.querySelector(".right_panel_unfolded");
const left_panel_unfolded = document.querySelector(".left_panel_unfolded");

right_panel_close?.addEventListener("click", () => {
  right_panel_unfolded.style.display = "none";
  folded_right_panel.style.cssText = "display: block !important";
});

left_panel_close?.addEventListener("click", () => {
  left_panel_unfolded.style.display = "none";
  folded_left_panel.style.display = "block";
});

folded_left_panel?.addEventListener("click", () => {
  left_panel_unfolded.style.display = "block";
  folded_left_panel.style.display = "none";
});

folded_right_panel?.addEventListener("click", () => {
  right_panel_unfolded.style.display = "block";
  folded_right_panel.classList.toggle("display_none");
});


// ============================================================
// PASSWORD EASTER EGG
// ============================================================

const pwd_reveal = document.querySelector("#pwd_reveal");
const pwd = document.querySelector("#pwd");
const pwd_submit = document.querySelector("#pwd_submit");

pwd_reveal?.addEventListener("click", () => {
  const hidden_pwd_step = document.querySelector("#hidden_pwd_step");
  if (hidden_pwd_step) hidden_pwd_step.style.display = "inline";
});

pwd?.addEventListener("input", () => {
  if (pwd_submit) {
    pwd_submit.style.cssText =
      "color:white; margin:0 10px; border:1px solid white; padding:3px 10px; width:40px; display:inline; cursor:pointer";
  }
});

pwd_submit?.addEventListener("click", () => {
  if (pwd.value === "never give in") {
    mosquitoGameStopped = true;
    pwd_submit.style.display = "none";
    fade_all_f();
  } else {
    pwd.value = "the horror...";
  }
});


// ============================================================
// CLUES AND SOCIAL MEDIA SHARING
// ============================================================

const clues = {
  "1": "Charlie Don't Surf. Nor does he patrol the river...",
  "2": "The blue *** is calling us",
  "3": "What does the world end with?",
  "4": "Sleep on it. CTRL + D",
  "5": "It smelled like slow death in there. Malaria and nightmares... Bzzz.",
  "6": "Every site's layout has a breaking point. The devil is in the detail"
};

// Replace this with your actual public website URL.
const page = "https://chromewebstore.google.com/detail/deemngaphalnilhllgpfdoenfchmkepc";

function shareOnFacebook() {
  window.open(
    "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(page),
    "facebook-share-dialog",
    "width=626,height=436"
  );
}

function shareOnReddit() {
  window.open(
    "https://www.reddit.com/submit?url=" + encodeURIComponent(page),
    "reddit-share-dialog",
    "width=800,height=600"
  );
}

function shareOnX() {
  const text = "Check out this image!";

  window.open(
    "https://x.com/intent/post?text=" + encodeURIComponent(text) +
    "&url=" + encodeURIComponent(page),
    "x-share-dialog",
    "width=550,height=450"
  );
}

const next_clue = document.querySelector("#next_clue");

next_clue?.addEventListener("click", () => {
  const clue_text = document.querySelector("#clue_text");
  if (!clue_text) return;

  const clue_class = parseInt(clue_text.classList[0], 10) + 1;

  browserStorage.get(obj => {
    posted = obj.posted;

    if (!posted) {
      clue_text.innerHTML = `
        <div style="margin-bottom:-10px;">
          This is the end of the river.<br>
          Contact Almighty for more clues:
          <br>
          <div style="position:relative; padding:20px 30px;">
            <i style="color:grey;">
              Hello, Almighty. Almighty, this is PBR Street Gang.
              Coordinates: ${page}
            </i>
            <div id="copy_to_clipboard">⧉</div>
            <div id="copy_text_label">copy</div>
          </div>
          <br>
          <div style="display:flex;align-items:center;">
            <img id="fb" src="https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/facebook.png" style="cursor:pointer;border:1px solid white;margin:0 5px;padding:3px 4px;height:25px;">
            <img id="twitter" src="https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/twitter.png" style="cursor:pointer;border:1px solid white;margin:0 5px;padding:3px;height:25px;">
            <img id="reddit" src="https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/reddit.png" style="cursor:pointer;border:1px solid white;margin:0 5px;padding:3px;height:25px;">
            <div style="padding-left:20px;line-height:25px;">
              ⇐ Pick a frequency
            </div>
          </div>
        </div>
      `;

      next_clue.style.display = "none";

      document.querySelector("#copy_to_clipboard")?.addEventListener("click", async () => {
        const label = document.querySelector("#copy_text_label");

        try {
          await navigator.clipboard.writeText(
            `Hello, Almighty. Almighty, this is PBR Street Gang. Coordinates: ${page}`
          );

          if (label) {
            label.textContent = "copied";
            label.style.color = "goldenrod";
          }
        } catch (error) {
          console.error("Clipboard copy failed:", error);
          if (label) label.textContent = "copy failed";
        }
      });

      document.querySelector("#fb")?.addEventListener("click", shareOnFacebook);
      document.querySelector("#twitter")?.addEventListener("click", shareOnX);
      document.querySelector("#reddit")?.addEventListener("click", shareOnReddit);

    } else {
      clue_text.className = "";

      if (clue_class < 7) {
        clue_text.classList.add(String(clue_class));
        clue_text.textContent = clues[String(clue_class)];
      } else {
        clue_text.classList.add("1");
        clue_text.textContent = clues["1"];
      }
    }
  });
});

document.querySelector("#reveal_clues_btn")?.addEventListener("click", () => {
  document.querySelector("#clue_box")?.classList.toggle("display_block");
});

document.querySelector("#clue_box_close_btn")?.addEventListener("click", () => {
  document.querySelector("#clue_box")?.classList.toggle("display_block");
});


// ============================================================
// ENDING
// ============================================================

function create_video_bkg_f() {
  const video = document.createElement("video");
  video.id = "kurtz_ext_bkg_img_id";
  video.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/kurtz2.mp4";
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  document.body.appendChild(video);
}

function append_goodbye_msg_f() {
  document.querySelector("#kurtz_ext_bkg_img_id")?.remove();

  const goodbye_msg = document.createElement("div");
  goodbye_msg.style.cssText =
    "color:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;";
  goodbye_msg.textContent = "The horror...";
  goodbye_msg.classList.add("fade_inout_3s");

  const img = document.createElement("img");
  img.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/icon2.png";
  img.style.cssText =
    "margin-top:-100px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:150px;";
  img.classList.add("fade_in_2s");
  document.body.appendChild(img);
  document.body.appendChild(goodbye_msg);

  setTimeout(() => {
    goodbye_msg.classList.add("fade_in_2s");
    goodbye_msg.classList.remove("fade_inout_3s");
    goodbye_msg.textContent = "Never give in to it.";

    setTimeout(() => {
      const success_msg = document.createElement("div");
      success_msg.style.cssText =
        "color:gold;margin-top:30px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;";
      success_msg.textContent = "Game unlocked successfully.";
      document.body.appendChild(success_msg);
    }, 3000);
  }, 3000);
}

let endingStarted = false;

function fade_all_f() {
  if (endingStarted) return;
  endingStarted = true;

  document.documentElement.style.cursor = "none";

  document.querySelectorAll("body > *").forEach(item => {
    item.classList.add("final_fade");
  });

  setTimeout(() => {
    create_video_bkg_f();

    setTimeout(() => {
      append_goodbye_msg_f();

      browserStorage.get(obj => {
        obj.locked = false;
        browserStorage.set(obj);
      });
    }, 16000);
  }, 7000);
}


// ============================================================
// GAME STATE AND COLLECTIBLES
// ============================================================

let finds = {};
let posted = false;
let score = 0;
let mosquitoGameStopped = false;

browserStorage.get(obj => {
  finds = obj.finds;
  score = obj.score;
  posted = obj.posted;

  if (finds.malaria) {
    mosquitoGameStopped = true;
  }

  gardenia_locks_check_f();
});

function collect_icon_f() {
  const alert_find_class = document.querySelector(".alert_find_class");
  if (!alert_find_class) return;

  const key = alert_find_class.id;
  const value = key + "_icon.png";

  browserStorage.get(obj => {
    if (obj.finds[key]) return;

    obj.score += 1;
    obj.finds[key] = value;

    browserStorage.set(obj, () => {
      score = obj.score;
      finds = obj.finds;
      gardenia_locks_check_f();
    });
  });
}

function gardenia_locks_check_f() {
  document.querySelectorAll(
    "div.heart_parent div.lock_div_parent img"
  ).forEach(img => img.remove());

  const finds_ar = Object.keys(finds);
  const locks = [
    ...document.querySelectorAll(
      "div.heart_parent div.lock_div_parent"
    )
  ];

  locks.forEach((item, i) => {
    const key = finds_ar[i];
    if (key === undefined) return;

    if (!finds[key]) {
      const img = document.createElement("img");
      img.classList.add("gardenia_img");
      img.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/gardenia.png";
      item.appendChild(img);
    } else {
      const img = document.createElement("img");
      img.classList.add("find_icon");
      img.src = `https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/${finds[key]}`;
      img.style.height = "100%";
      img.style.width = "100%";
      item.style.border = "none";
      item.appendChild(img);
    }
  });

  const found = Object.values(finds);

  if (found.length && found.every(Boolean)) {
    fade_all_f();
  }
}


// ============================================================
// SOCIAL TEST BUTTON
// ============================================================

document.querySelector("#fb_testing")?.addEventListener("click", shareOnFacebook);


// ============================================================
// DATE AND TIME
// ============================================================

if (typeof custom_alert_f === "function") {
  custom_alert_f();
}

const mission_date_span = document.querySelector("#mission_date_span");

if (mission_date_span) {
  mission_date_span.textContent = new Date();
}


// ============================================================
// RESIZE EASTER EGG
// ============================================================

window.addEventListener("resize", () => {
  if (!finds.devil && window.innerWidth === 666) {
    htmlAlert( `<div class="alert_find_class" id="devil"> <br><br><br> The good does not always triumph. Sometimes the dark side overcomes what Lincoln called the better angels of our nature. Proceed. With extreme prejudice. </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/devil_icon.png" );
  }
});


// ============================================================
// TIME-BASED EASTER EGGS
// ============================================================

function now_time_f() {
  const now = new Date();
  return String(now.getHours()) + String(now.getMinutes());
}

setInterval(() => {
  const now_time = now_time_f();

  if (now_time === "70" && !finds.napalm) {
    htmlAlert( `<div class="alert_find_class" id="napalm"> <br><br><br> Early bird catches the sight of napalm strike. I like the smell of traffic in the morning. Some day this life is going to end... </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/napalm_icon.png" );
  }

  if (now_time === "1729") {
    blue_bus_arrival_f();
  }
}, 55000);


// ============================================================
// KEYBOARD SHORTCUT
// ============================================================

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    alert(
      "The bookmark of the page has been created successfully. " +
      "See you in the morning. Don't be late son! " +
      "I like to finish operations early."
    );
  }
});


// ============================================================
// THE BLUE BUS
// ============================================================

function blue_bus_arrival_f() {
  if (finds.blue_bus || document.querySelector("#bus_parent")) return;

  const bus_div = document.createElement("div");
  bus_div.id = "bus_parent";
  bus_div.classList.add("bus_arrival");
  bus_div.style.height = "0px";

  const bus_img = document.createElement("img");
  bus_img.id = "bus";
  bus_img.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/bluefront.png";
  bus_img.style.width = "100%";
  bus_img.style.height = "auto";

  bus_div.appendChild(bus_img);
  document.body.appendChild(bus_div);

  setTimeout(() => {
    bus_img.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/blueback.png";
    bus_div.classList.add("bus_departure");

    htmlAlert( `<div class="alert_find_class" id="blue_bus"> <br><br><br> The killer awoke before dawn He put his boots on He took a face from the ancient gallery And he walked on down the hall. </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/blue_bus_icon.png" );
  }, 3000);
}


// ============================================================
// TEMPLE / HEART OF DARKNESS
// ============================================================

const temple_img = document.querySelector("#temple");

temple_img?.addEventListener("click", () => {
  temple_img.classList.remove("temple_fade");

  document.querySelector("h3.header")?.classList.add("display_none");
  document.querySelector("h3.header2")?.classList.add("display_block");

  const kurtz_bkg = document.querySelector(".kurtz_bkg");
  const black_heart_bkg = document.querySelector(".black_heart_bkg");
  const heart_parent = document.querySelector(".heart_parent");

  if (kurtz_bkg) kurtz_bkg.style.display = "none";
  if (black_heart_bkg) black_heart_bkg.style.display = "block";
  if (heart_parent) heart_parent.style.display = "block";
});


// ============================================================
// CLICK AND HOLD OVER FIVE SECONDS
// ============================================================

function create_searching_tag_f() {
  const pbr_parent = document.querySelector(".pbr_parent");
  if (!pbr_parent || document.querySelector("#searching_tag")) return;

  const search_el = document.createElement("div");
  search_el.id = "searching_tag";
  search_el.textContent = " searching...";
  pbr_parent.appendChild(search_el);
}

function charlie_dont_surf_f() {
  if (!finds.surf) {
    htmlAlert( `<div class="alert_find_class" id="surf"> <br><br><br> You have found a surfing board. That's good, son! 'Cause you either surf or fight! That clear?! </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/surf_icon.png" );
  }
}

function create_bus_notice_f() {
  const pbr_parent = document.querySelector(".pbr_parent");
  if (!pbr_parent || document.querySelector("#bus_notice")) return;

  const bus_notice = document.createElement("p");
  bus_notice.textContent =
    "⛔ PBR service suspended.\nReplacement bus service:\n10:30, 17:00";
  bus_notice.id = "bus_notice";
  pbr_parent.prepend(bus_notice);
}

let timer;
let timer2;
let timer3;

const element = document.querySelector("#boat");

function cancelBoatTimers() {
  clearTimeout(timer);
  clearTimeout(timer2);
  clearTimeout(timer3);
  document.querySelector("#searching_tag")?.remove();
}

element?.addEventListener("mousedown", () => {
  timer = setTimeout(() => {
    create_searching_tag_f();

    timer2 = setTimeout(() => {
      if (!document.querySelector("#bus_notice")) {
        create_bus_notice_f();
      }

      timer3 = setTimeout(() => {
        charlie_dont_surf_f();
      }, 1000);
    }, 3000);
  }, 1000);
});

element?.addEventListener("mouseup", cancelBoatTimers);
element?.addEventListener("mouseleave", cancelBoatTimers);
element?.addEventListener("touchend", cancelBoatTimers);
element?.addEventListener("touchcancel", cancelBoatTimers);


// ============================================================
// CHEF'S HEAD
// ============================================================

function chef_head_f() {
  if (finds.chef_head) return;

  const chef_head = document.querySelector("#chef_head");
  chef_head?.classList.add("roll");

  const wait_2s = setInterval(() => {
    htmlAlert( `<div class="alert_find_class" id="chef_head"> <br><br><br> You have found Chef's head. <br> <span style="font-weight:600;"> With Chef's head OFF, 100% discount ON </span> premium features of the next Chrome browser extension for all testers with a code: 'CHEF-ON-A-ROLL'. <a href="https://docs.google.com/forms/d/e/1FAIpQLSdDwJ0xurSVOnqtzGiHtjdYCRysr3sPdBRjnGDjt7qSlkkYmw/viewform?usp=publish-editor" style="color:gold;font-weight:600;" target="_blank" rel="noopener"> Become a tester </a> <br><br>...Is my copywriting unsound? </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/chef_head_icon.png" );

    clearInterval(wait_2s);
  }, 2500);
}

let trg_word_triggered = false;
const trg_word = document.querySelector("#trg_word");

trg_word?.addEventListener("click", () => {
  if (trg_word_triggered) return;

  trg_word_triggered = true;
  chef_head_f();

  setTimeout(() => {
    trg_word_triggered = false;
  }, 3000);
});


// ============================================================
// CUSTOM COLLECTIBLE ALERT
// ============================================================

function custom_alert_f() {
  const alertClone = (message = "", icon_img_src) => {
    const div_top_bar = document.createElement("div");
    div_top_bar.style.cssText =
      "display:flex;position:absolute;top:0;left:0;width:100%;padding:0 13px;margin-top:12px;";

    const div_congrats = document.createElement("div");
    div_congrats.style.cssText =
      "line-height:35px;padding:0 8px;color:goldenrod;font-size:16px;";
    div_congrats.textContent = "Congratulations!";

    const icon_img = document.createElement("img");
    icon_img.src = icon_img_src;
    icon_img.style.cssText =
      "width:35px;height:35px;border-radius:3px;margin-left:3px;";

    const temple_corner_el = document.createElement("div");
    const temple_img = document.createElement("img");
    const temple_found_score = document.createElement("div");

    temple_found_score.textContent = `${String(score)} / 6`;
    temple_found_score.style.lineHeight = "45px";

    temple_corner_el.style.cssText =
      "margin-left:auto;padding:0 30px;display:flex;color:white;";
    temple_img.style.cssText = "width:45px;";
    temple_img.src = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/temple.png";

    temple_corner_el.append(temple_found_score, temple_img);

    const overlay = document.createElement("div");
    const box = document.createElement("div");
    const text = document.createElement("div");
    const button = document.createElement("button");

    //position: fixed; inset: 0px; background: rgba(0, 0, 0, 0.3); z-index: 2147483647;

    overlay.style.cssText = "margin-bottom: 80px !important; position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:2147483647;";

    box.style.cssText = `
      position:absolute;top:13%;left:50%;margin-top:30px;
      transform:translate(-50%,-50%);min-width:370px;max-width:400px;
      padding:15px;background:black;color:goldenrod;
      border:1px solid goldenrod;box-shadow:0 2px 12px rgba(0,0,0,.3);
      font:13.3333px Arial,sans-serif;border-radius:8px;
    `;

    text.style.cssText =
      "margin-bottom:20px;white-space:pre-wrap;overflow-wrap:anywhere;";

    button.style.cssText = `
      display:block;margin-left:auto;min-width:70px;height:30px;
      border:0;border-radius:4px;background:goldenrod;outline:none;
      color:white;font:13.3333px Arial,sans-serif;cursor:pointer;
    `;

    // Existing alert messages intentionally contain HTML markup.
    text.innerHTML = message;
    button.id = "alert_collect_btn";
    button.textContent = "Collect";

    let resolveAlert;
    let closed = false;

    const promise = new Promise(resolve => {
      resolveAlert = resolve;
    });

    const timer = setTimeout(close, 60000);

    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer);
      overlay.remove();
      window.dispatchEvent(new Event("alertclosed"));
      resolveAlert();
    }

    button.addEventListener("click", () => {
      collect_icon_f();
      close();
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) close();
    });

    div_top_bar.append(icon_img, div_congrats, temple_corner_el);
    box.append(div_top_bar, text, button);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    button.focus();

    return promise;
  };

  window.htmlAlert = alertClone;
}


// ============================================================
// MOSQUITO GAME
// ============================================================

const mosquitoImage = "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/mosquito.png";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createBuzz(x, y) {
  const buzz = document.createElement("div");
  buzz.textContent = "bzzzzz";

  Object.assign(buzz.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    fontSize: "10px",
    fontStyle: "italic",
    fontFamily: "cursive",
    color: "white",
    zIndex: "9999",
    pointerEvents: "none"
  });

  document.body.appendChild(buzz);
  return buzz;
}

function createMosquito(x, y, onKill) {
  const img = document.createElement("img");
  img.src = mosquitoImage;
  img.alt = "Mosquito";

  Object.assign(img.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: "35px",
    zIndex: "9999",
    cursor: "crosshair"
  });

  img.addEventListener("click", () => {
    img.remove();
    onKill();
  }, { once: true });

  document.body.appendChild(img);
  return img;
}

function createStain(x, y) {
  const kurtz_quote = document.createElement("div");
  kurtz_quote.classList.add("stain_fade_out");
  kurtz_quote.textContent = '"The nobility of the man is judged by how much Truth he can handle" - Colonel Walter E. Kurtz';
  Object.assign(kurtz_quote.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    marginLeft: "-195px",
    marginTop: "-75px",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "15px"
  });

  const stain = document.createElement("div");
  stain.classList.add("stain_fade_out");
  stain.innerHTML = "Over <br> 600 million <br> die of malaria <br> p.a. ";


  Object.assign(stain.style, {
    textAlign: "center",
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: "95px",
    height: "95px",
    padding: "10px",
    background: "red",
    color: "#f5dddd",
    borderRadius: "50%",
    zIndex: "10000",
    lineHeight: "1.4"
  });

  document.body.append(stain, kurtz_quote);

  setTimeout(() => {
    htmlAlert( `<div class="alert_find_class" id="malaria"> <br><br><br> One less blood-sucking malaria-spreading creature! <br> Not even Colonel Kurtz deserves a head that yellow. <br><br> ...Don't buy me a coffee for some yuppie middleman to sip 10% out of. Consider buying a 2$ malaria bed net through the <a style="font-weight:600;" href="https://againstmalaria.com/" target="_blank" rel="noopener">againstmalaria.com</a> fund instead. </div>`, "https://raw.githubusercontent.com/vojtechzvelebil/kurtz_imgs2/refs/heads/main/malaria_icon.png" );
  }, 1000);
}

function runCycle() {
  if (mosquitoGameStopped) return;

  const marginX = Math.min(500, window.innerWidth / 2);
  const marginY = Math.min(500, window.innerHeight / 2);

  const x = random(marginX, Math.max(marginX + 1, window.innerWidth - marginX));
  const y = random(marginY, Math.max(marginY + 1, window.innerHeight - marginY));

  const buzz = createBuzz(x, y);

  setTimeout(() => {
    if (mosquitoGameStopped) {
      buzz.remove();
      return;
    }

    buzz.remove();

    const angle = random(0, Math.PI * 2);
    const distance = random(50, 150);

    const mx = clamp(
      x + Math.cos(angle) * distance,
      20,
      Math.max(20, window.innerWidth - 60)
    );

    const my = clamp(
      y + Math.sin(angle) * distance,
      20,
      Math.max(20, window.innerHeight - 60)
    );

    let killed = false;

    const mosquito = createMosquito(mx, my, () => {
      killed = true;
      mosquitoGameStopped = true;
      createStain(mx, my);
    });

    setTimeout(() => {
      if (!killed) mosquito.remove();

      if (!mosquitoGameStopped) {
        setTimeout(runCycle, random(5000, 10000));
      }
    }, 1500);
  }, 2000);
}

setTimeout(runCycle, 2000);
