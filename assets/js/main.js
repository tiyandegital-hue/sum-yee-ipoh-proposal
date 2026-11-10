// Sum Yee Hair & Beauty — shared interactions. No external deps.
(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // Mobile menu
  var burger=$("#burger"), mmenu=$("#mmenu");
  if(burger&&mmenu){
    burger.addEventListener("click",function(){mmenu.classList.add("open");document.body.style.overflow="hidden";});
    $$(".mmenu .close, .mmenu a.mlink",mmenu).forEach(function(el){
      el.addEventListener("click",function(){mmenu.classList.remove("open");document.body.style.overflow="";});
    });
  }

  // Copy-to-clipboard buttons: data-copy-target = selector of text source
  $$("[data-copy]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var src=$(btn.getAttribute("data-copy"));
      var text=src ? (src.value!==undefined?src.value:src.textContent) : "";
      function done(){ var o=btn.textContent; btn.textContent="Copied ✓"; setTimeout(function(){btn.textContent=o;},1800); }
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(function(){fallback();}); }
      else fallback();
      function fallback(){ var ta=document.createElement("textarea"); ta.value=text; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta); done(); }
    });
  });

  // Lookbook filters + Book This Look
  $$(".chip[data-filter]").forEach(function(chip){
    chip.addEventListener("click",function(){
      $$(".chip[data-filter]").forEach(function(c){c.classList.remove("active");c.setAttribute("aria-pressed","false");});
      chip.classList.add("active"); chip.setAttribute("aria-pressed","true");
      var f=chip.getAttribute("data-filter");
      $$(".look").forEach(function(card){
        var show=(f==="all"||card.getAttribute("data-cat")===f);
        card.classList.toggle("hidden",!show);
      });
      var n=$$(".look:not(.hidden)").length;
      var count=$("#look-count"); if(count) count.textContent=n+" look"+(n===1?"":"s")+" shown";
    });
  });
  $$("[data-book-look]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var look=btn.getAttribute("data-book-look");
      var field=$("#lb-look"); if(field){ field.value=look; field.dispatchEvent(new Event("input",{bubbles:true})); field.dispatchEvent(new Event("change",{bubbles:true})); }
      var form=$("#lb-form"); if(form){ form.scrollIntoView({behavior:"smooth",block:"start"}); }
      var prev=$("#lb-preview"); if(prev){ prev.focus&&prev.focus(); }
    });
  });

  // Generic concierge preview builder: reads fields in a form, writes into preview element
  function buildMsg(form){
    var g=function(n){ var el=form.querySelector('[name="'+n+'"]'); if(!el) return ""; if(el.type==="radio"||el.type==="checkbox"){ var c=form.querySelector('[name="'+n+'"]:checked'); return c?c.value:""; } return el.value||""; };
    return g;
  }
  // Services concierge
  var svcForm=$("#svc-concierge");
  if(svcForm){
    var svcPrev=$("#svc-preview");
    var updateSvc=function(){
      var g=buildMsg(svcForm);
      var branch=g("branch"), ritual=g("ritual"), day=g("day"), name=g("name");
      var lines=["Hello Sum Yee Hair & Beauty!","",
        "I would like to enquire about booking a consultation.",
        "• Enclave: "+(branch||"[choose a branch]"),
        "• Ritual: "+(ritual||"[choose a ritual]"),
        "• Preferred day: "+(day||"[choose a day]")];
      if(name) lines.push("• Name: "+name);
      lines.push("","Could you please advise on availability and consultation timing?","Thank you!");
      svcPrev.textContent=lines.join("\n");
    };
    svcForm.addEventListener("input",updateSvc); svcForm.addEventListener("change",updateSvc); updateSvc();
  }
  // Lookbook reservation
  var lbForm=$("#lb-form");
  if(lbForm){
    var lbPrev=$("#lb-preview");
    var updateLb=function(){
      var g=buildMsg(lbForm);
      var look=g("look"), branch=g("branch"), name=g("name"), date=g("date");
      var lines=["Hello Sum Yee Hair & Beauty!","",
        "I saw your lookbook and I would like to book a consultation"+(look?(' for "'+look+'"'):"")+".",
        "• Enclave: "+(branch||"[choose a branch]")];
      if(name) lines.push("• Name: "+name);
      if(date) lines.push("• Preferred date: "+date);
      lines.push("","Could you please advise on availability and consultation timing?","Thank you!");
      lbPrev.textContent=lines.join("\n");
    };
    lbForm.addEventListener("input",updateLb); lbForm.addEventListener("change",updateLb); updateLb();
  }
  // Academy enquiry
  var acForm=$("#ac-form");
  if(acForm){
    var acPrev=$("#ac-preview");
    var updateAc=function(){
      var g=buildMsg(acForm);
      var track=g("track"), exp=g("experience"), name=g("name"), visit=g("visit");
      var lines=["Hello Sum Yee Academy,","",
        "I would like to enquire about the upcoming intake"+(track?(" for "+track):"")+".",
        "• Experience: "+(exp||"[choose one]")];
      if(name) lines.push("• Name: "+name);
      if(visit) lines.push("• Preferred visit: "+visit);
      lines.push("","Could you please share the syllabus overview and arrange a studio visit?","Thank you!");
      acPrev.textContent=lines.join("\n");
    };
    acForm.addEventListener("input",updateAc); acForm.addEventListener("change",updateAc); updateAc();
  }
  // Locations concierge
  var locForm=$("#loc-concierge");
  if(locForm){
    var locPrev=$("#loc-preview");
    var updateLoc=function(){
      var g=buildMsg(locForm);
      var branch=g("branch"), ritual=g("ritual"), room=g("room");
      var lines=["Hello Sum Yee Hair & Beauty!","",
        "I would like to enquire about booking:",
        "• Enclave: "+(branch||"[choose a branch]"),
        "• Ritual: "+(ritual||"[choose a ritual]"),
        "• Room preference: "+(room||"[choose one]"),
        "","Could you please advise on availability and consultation timing?","Thank you!"];
      locPrev.textContent=lines.join("\n");
    };
    locForm.addEventListener("input",updateLoc); locForm.addEventListener("change",updateLoc); updateLoc();
  }

  // BOOK page — live draft
  var bookForm=$("#book-form");
  if(bookForm){
    var draft=$("#book-draft"), dockSum=$("#dock-summary"), drawerDraft=$("#drawer-draft");
    var dayChips=$$(".daystrip .pill-btn");
    function val(name){ var c=bookForm.querySelector('[name="'+name+'"]:checked'); return c?c.value:""; }
    function txt(name){ var el=bookForm.querySelector('[name="'+name+'"]'); return el?el.value.trim():""; }
    function updateBook(){
      var branch=val("branch"), ritual=val("ritual"), day=val("day"), time=val("time");
      var suite=bookForm.querySelector('[name="suite"]');
      var name=txt("name"), phone=txt("phone"), notes=txt("notes");
      var lines=["Hello Sum Yee Hair & Beauty!","",
        "I would like to request an appointment consultation:",
        "• Enclave: "+(branch||"[choose a branch]"),
        "• Selected ritual: "+(ritual||"[choose a ritual]"),
        "• Private suite: "+(suite&&suite.checked?"Muslimah Private Suite requested":"Not requested"),
        "• Preferred day: "+(day||"[choose a day]"),
        "• Preferred time: "+(time||"[choose a time]")];
      if(name) lines.push("• Client name: "+name+(phone?" ("+phone+")":""));
      else if(phone) lines.push("• Contact: "+phone);
      if(notes) lines.push("• Hair history & notes: "+notes);
      lines.push("","Could you please advise on availability and consultation timing?","Thank you! — Sent via the Sum Yee booking demo");
      var msg=lines.join("\n");
      if(draft) draft.textContent=msg;
      if(drawerDraft) drawerDraft.textContent=msg;
      if(dockSum){
        var short=[branch?branch.split(" — ")[0]:"Choose branch", ritual||"Choose ritual"].join(" • ");
        dockSum.innerHTML="<b>Demo booking</b>"+short;
      }
    }
    bookForm.addEventListener("input",updateBook); bookForm.addEventListener("change",updateBook);
    // pill buttons (day/time) act as radios
    $$("[data-pill-group]").forEach(function(btn){
      btn.addEventListener("click",function(){
        var grp=btn.getAttribute("data-pill-group");
        $$('[data-pill-group="'+grp+'"]').forEach(function(b){b.classList.remove("active");b.setAttribute("aria-pressed","false");});
        btn.classList.add("active"); btn.setAttribute("aria-pressed","true");
        var hidden=bookForm.querySelector('input[name="'+grp+'"][value="'+btn.getAttribute("data-value")+'"]');
        if(hidden){ hidden.checked=true; }
        updateBook();
      });
    });
    updateBook();
    // drawer
    var drawer=$("#drawer"), openBtn=$("#open-drawer"), closeBtn=$("#close-drawer");
    if(openBtn&&drawer){ openBtn.addEventListener("click",function(){ drawer.classList.add("open"); }); }
    if(closeBtn&&drawer){ closeBtn.addEventListener("click",function(){ drawer.classList.remove("open"); }); }
  }

  // Footer year
  var y=$("#yr"); if(y) y.textContent=new Date().getFullYear();
})();
