let optionsMenu = {
    container: undefined,
    toggleVisibility: undefined,
    addNewMenu: function() {
        let o = document.createElement('div');
        let container = document.createElement('div');
        let toggleVisibility = document.createElement('div');
        o.classList.add('optionsMenu');
        container.classList.add('optionsMenu-container');
        toggleVisibility.classList.add('optionsMenu-toggleVisibility');
        toggleVisibility.innerText = "show options";
        o.appendChild(container);
        o.appendChild(toggleVisibility);
        document.body.appendChild(o);
        document.querySelector('.optionsMenu').style.top = "-9999px";
        optionsMenu.container = container;
        optionsMenu.toggleVisibility = toggleVisibility;
        optionsMenu.shown = false;
        document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
        document.querySelector('.optionsMenu-toggleVisibility').addEventListener('click', function(e){
            if (optionsMenu.shown) {
                e.target.innerText = "show options";
                document.querySelector('.optionsMenu').style.top = (e.target.offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
            } 
            else {
                e.target.innerText = "hide options";
                document.querySelector('.optionsMenu').style.top = "10px"
            }
            optionsMenu.shown = !!((optionsMenu.shown + 1)%2);
        });
    },
    addNewOption: function({type = 'button', description = 'todo', func, inputClass, value, minValue = 0, maxValue = 100, step = 1, placeholder = "todo", actualizedProperty, optionsForList = [{text:"option", func: function(){}}]} = {}) {
        let optionDiv = document.createElement('div');
        optionDiv.classList.add('optionsMenu-option');

        let input = document.createElement('input'); 
        input.type = type;
        input.min = minValue;

        let labelDiv = document.createElement('div');
        labelDiv.classList.add("optionsMenu-label");
        labelDiv.innerHTML = description;

        let inputDiv = document.createElement('div');
        inputDiv.classList.add(`optionsMenu-${type}Input`);
        
        if (type!="list") {
            inputDiv.appendChild(input);
            optionDiv.appendChild(inputDiv);
            optionsMenu.container.appendChild(optionDiv);
        }

        let eventType = "input";

        func = func ?? 
        (type=="range" ? 
        function(e) {optionsMenu[actualizedProperty] = +e.target.value;} 
        : type=="checkbox" ? function(e) {optionsMenu[actualizedProperty] = e.target.checked;} : function(e) {optionsMenu[actualizedProperty] = e.target.value;});

        let newFunc = function(e) {func(e)}

        if (actualizedProperty!=undefined) optionsMenu[actualizedProperty] = value ?? undefined;

        switch (type) {
            case "button":
                input.value = description;
                eventType = "click";
            break;
            case "range":
                let rangeSpan = document.createElement('span');
                newFunc = function(e){
                    rangeSpan.innerText = e.target.value;
                    func(e);
                }
                input.min = minValue;
                input.max = maxValue;
                input.step = step;
                input.value = value ?? 0;
                optionsMenu[actualizedProperty] = value ?? 0;
                labelDiv.innerText = `${description}: `;
                rangeSpan.classList.add(inputClass+"Span");
                labelDiv.appendChild(rangeSpan);
                rangeSpan.innerText = input.value;
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
            case "text":
                input.value = value ?? "";
                optionsMenu[actualizedProperty] = value ?? "";
                input.placeholder = placeholder;
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
            case "checkbox":
                input.checked = value;
                input.insertAdjacentHTML("afterend", description);
            break;
            case "list":
                input = document.createElement('select');
                let opt;
                for (let i=0; i<optionsForList.length; i++) {
                    opt = document.createElement('option');
                    opt.value = optionsForList[i].value;
                    opt.innerText = optionsForList[i].text;
                    input.appendChild(opt);
                }
                inputDiv.appendChild(input);
                optionDiv.appendChild(inputDiv);
                optionsMenu.container.appendChild(optionDiv);
                optionDiv.insertBefore(labelDiv, optionDiv.firstChild);
            break;
        }
        if (inputClass != undefined) input.classList.add(inputClass);
        input.addEventListener(eventType, newFunc); 
        document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";   
    },
    actualize: function({particles, speed, size, dcr, afterimage, angle, ptcr}) {
        if (speed != undefined) {
            document.querySelector('.speed').value = speed ?? optionsMenu.particlesSpeed;
            document.querySelector('.speed').dispatchEvent(new Event('input'));
        }
        if (size != undefined) {
            document.querySelector('.size').value = size ?? optionsMenu.particlesSize;
            document.querySelector('.size').dispatchEvent(new Event('input'));
        }
        if (dcr != undefined) {
            document.querySelector('.directionChangeRate').value = dcr ?? optionsMenu.particlesChangeDirectionRate;
            document.querySelector('.directionChangeRate').dispatchEvent(new Event('input'));
        }
        if (afterimage != undefined) {
            document.querySelector('.afterimage').value = afterimage ?? optionsMenu.afterimage;
            document.querySelector('.afterimage').dispatchEvent(new Event('input'));
        }
        if (angle != undefined) {
            document.querySelector('.angle').value = angle ?? optionsMenu.angle;
            document.querySelector('.angle').dispatchEvent(new Event('input'));
        }
        if (ptcr != undefined) {
            document.querySelector('.positiveTurnChangeRate').value = ptcr ?? optionsMenu.particlesChangeDirectionRate;
            document.querySelector('.positiveTurnChangeRate').dispatchEvent(new Event('input'));
        }
        if (particles != undefined) {
            document.querySelector('.particles').value = particles ?? optionsMenu.maxParticles;
            document.querySelector('.particles').dispatchEvent(new Event('input'));
        }
    }
}

optionsMenu.addNewMenu()
optionsMenu.addNewOption({type: "list", description: "try one of predefined options", optionsForList: [
    {value: "standard", text: "standard"}, 
    {value: "colorful", text: "colorful madness"}, 
    {value: "square", text: "square net"}, 
    {value: "just", text: "just particles"}, 
    {value: "antigravity", text: "antigravity"}], 
    func: function(e){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        switch(e.target.value) {
            case 'standard': optionsMenu.actualize({particles: 300, speed: 0.25, size: 4, dcr: 0.75, afterimage: 0.2, angle: 10, border: 'portal', ptcr: 0.9}); break;
            case 'colorful': 
                particles = [];
                optionsMenu.actualize({particles: 500, speed: 0.2, size: 10, dcr: 0.3, afterimage: 0.01, angle: 5, border: 'portal', ptcr: 0.5}); 
            break;
            case 'square': 
                particles = [];
                optionsMenu.actualize({particles: 500, speed: 0.2, size: 3, dcr: 0.01, afterimage: 0.1, angle: 90, border: 'portal', ptcr: 0.5}); 
            break;
            case 'antigravity': 
                particles = [];
                optionsMenu.actualize({particles: 350, speed: 0.33, size: 7, dcr: 0.3, afterimage: 0.1, angle: 10, border: 'portal', ptcr: 0.05}); 
            break;
            case 'just': 
                particles = [];
                optionsMenu.actualize({particles: 350, speed: 0.33, size: 15, dcr: 0.1, afterimage: 1, angle: 5, border: 'portal', ptcr: 0.5}); 
            break;
        }
    }
});

optionsMenu.addNewOption({type: "range", description: "particles", inputClass: 'particles', value: 300, minValue: 0, maxValue: 1000, actualizedProperty: "maxParticles", 
func: function(e) {
    optionsMenu.maxParticles = +e.target.value;
    if (particles.length>optionsMenu.maxParticles) particles.length = optionsMenu.maxParticles;
    else while (particles.length<optionsMenu.maxParticles) particles.push(newParticle());
}});
optionsMenu.addNewOption({type: "range", description: "particles speed", inputClass: 'speed', value: 0.25, maxValue: 1, step: 0.01, actualizedProperty: "particlesSpeed"});
optionsMenu.addNewOption({type: "range", description: "particles size", inputClass: 'size', value: 4, minValue: 1, maxValue: 20, actualizedProperty: "particlesSize"});
optionsMenu.addNewOption({type: "range", description: "direction change rate", inputClass: 'directionChangeRate', value: 0.75, minValue: 0, maxValue: 1, step: 0.01, actualizedProperty: "particlesChangeDirectionRate"});
optionsMenu.addNewOption({type: "range", description: "afterimage", inputClass: 'afterimage', value: 0.2, minValue: 0, maxValue: 1, step: 0.01, actualizedProperty: "afterimage"});
optionsMenu.addNewOption({type: "range", description: "angle", inputClass: 'angle', value: 10, minValue: 5, maxValue: 180, step: 5, actualizedProperty: "angle"});
optionsMenu.addNewOption({type: "range", description: "turn to cursor chance", inputClass: 'positiveTurnChangeRate', value: 0.9, minValue: 0, maxValue: 1, step: 0.01, actualizedProperty: "positiveTurnChangeRate"});
optionsMenu.addNewOption({type: "list", description: "type of border", inputClass: 'border', actualizedProperty: "border", optionsForList: [{value: "portal", text: "portal"}, {value: "border", text: "solid"}, {value: "none", text: "none"}]})
optionsMenu.addNewOption({type: "button", description: "clear canvas", func: function(){ctx.clearRect(0,0,canvas.width, canvas.height)}});

optionsMenu.maxParticles = 300,
optionsMenu.particleLifespan = Infinity;
optionsMenu.particlesSpeed = 0.25;
optionsMenu.particlesSize = 4;
optionsMenu.particlesChangeDirectionRate = 0.75;
optionsMenu.afterimage = 0.2;
optionsMenu.angle = 10;
optionsMenu.border = "portal";
optionsMenu.minDistance = Infinity;
optionsMenu.positiveTurnChangeRate = 0.9;

window.addEventListener('load', function(){
    document.querySelector('.optionsMenu').style.top = (document.querySelector('.optionsMenu-toggleVisibility').offsetHeight - document.querySelector('.optionsMenu').offsetHeight) + "px";
}, {once: true});