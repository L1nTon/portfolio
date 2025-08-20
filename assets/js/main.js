// Canvas Background Animation
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;
let connectionDistance = window.innerWidth > 768 ? 150 : 100;
let mouseX = 0;
let mouseY = 0;
let mouseRadius = window.innerWidth > 768 ? 150 : 100;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    connectionDistance = window.innerWidth > 768 ? 150 : 100;
    mouseRadius = window.innerWidth > 768 ? 150 : 100;
});

window.addEventListener('mousemove', (e) => {
    mouseX = e.x;
    mouseY = e.y;
});

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(74, 108, 250, ${Math.random() * 0.5 + 0.3})`;
    }
    
    update() {
        // Move particles
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
        
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseRadius - distance) / mouseRadius;
            
            this.speedX -= forceDirectionX * force * 0.2;
            this.speedY -= forceDirectionY * force * 0.2;
            
            // Speed limit
            this.speedX = Math.max(Math.min(this.speedX, 2), -2);
            this.speedY = Math.max(Math.min(this.speedY, 2), -2);
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(74, 108, 250, ${(connectionDistance - distance) / connectionDistance * 0.4})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// Initialize and start animation
init();
animate();

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    // For demo purposes, we'll just log it
    console.log('Form submitted:', { name, email, subject, message });
    
    // Show success message (in a real app)
    alert('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.');
    
    // Reset form
    this.reset();
});



// MENU
const burgerMenu = document.getElementById('burgerMenu');
const closeButton = document.getElementById('closeButton');
const menuContainer = document.getElementById('menuContainer');
const menuWrapper = document.getElementById('menuWrapper');
const menuScrollContainer = document.getElementById('menuScrollContainer');
const menuItems = document.querySelectorAll('.menu-item');
const bgTexts = document.querySelectorAll('.bg-text span')

// Variables
let isMenuOpen = false;
let menuWidth = 0;
let containerWidth = 0;
let maxScroll = 0;
let activeItemIndex = 0;

// Calculate sizes
function calculateSizes() {
  menuWidth = menuWrapper.offsetWidth;
  containerWidth = menuScrollContainer.offsetWidth;
  maxScroll = menuWidth - containerWidth;
  
  // If menu is smaller than container, center it
  if (menuWidth <= containerWidth) {
    menuWrapper.style.left = `${(containerWidth - menuWidth) / 2}px`;
    maxScroll = 0;
  } else {
    menuWrapper.style.left = '0px';
  }
  }

// Apply a non-linear speed curve to the mouse position
function applySpeedCurve(mouseXPercent) {
  // Define regions of different speeds
  // Middle region (30%-70%): slower movement
  // Edge regions (0-30% and 70-100%): faster movement
  
  if (mouseXPercent < 0.3) {
    // Left edge - accelerated movement
    // Map 0-0.3 to 0-0.4 (faster at edges)
    return (mouseXPercent / 0.3) * 0.4;
  } else if (mouseXPercent > 0.7) {
    // Right edge - accelerated movement
    // Map 0.7-1.0 to 0.6-1.0 (faster at edges)
    return 0.6 + ((mouseXPercent - 0.7) / 0.3) * 0.4;
  } else {
    // Middle section - slower movement
    // Map 0.3-0.7 to 0.4-0.6 (slower in middle)
    return 0.4 + ((mouseXPercent - 0.3) / 0.4) * 0.2;
  }
}

// Initialize menu
function initMenu() {
  calculateSizes();
  window.addEventListener('resize', calculateSizes);
  
  // Toggle menu
  burgerMenu.addEventListener('click', () => {
    document.body.style.overflowY = 'hidden'
    isMenuOpen = true;
    menuContainer.classList.add('active');
    document.querySelector('.background-container').style.zIndex = '99';
    calculateSizes();
  });
  
  closeButton.addEventListener('click', () => {
    document.body.style.overflowY = 'auto'
    isMenuOpen = false;
    menuContainer.classList.remove('active');
    document.querySelector('.background-container').style.zIndex = '0';
  });
  
  // Menu item click
  menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      activeItemIndex = index;
      updateActiveItem();
      closeButton.click();
    });
  });
  
  // Track mouse movement across entire menu container
  menuContainer.addEventListener('mousemove', (e) => {
    if (!isMenuOpen || maxScroll <= 0) return;
    
    // Get mouse X position relative to viewport width
    const viewportWidth = window.innerWidth;
    const mouseXPercent = e.clientX / viewportWidth;
    
    // Apply non-linear speed curve
    const adjustedPercent = applySpeedCurve(mouseXPercent);
    
    // Calculate scroll position with the adjusted percentage
    const scrollPosition = adjustedPercent * maxScroll;

    // Apply scroll position
    menuWrapper.style.transform = `translateX(-${scrollPosition}px)`;
    
    // Find the most centered item and make it active
    // updateActiveItemBasedOnPosition(scrollPosition);
  });
}

// Update active item based on current scroll position
function updateActiveItemBasedOnPosition(scrollPosition) {
  const containerCenter = containerWidth / 2;
  let closestItem = 0;
  let closestDistance = Infinity;
  
  menuItems.forEach((item, index) => {
    const itemCenter = item.offsetLeft + (item.offsetWidth / 2) - scrollPosition;
    const distanceToCenter = Math.abs(itemCenter - containerCenter);
    
    if (distanceToCenter < closestDistance) {
      closestDistance = distanceToCenter;
      closestItem = index;
    }
  });
  
  if (activeItemIndex !== closestItem) {
    activeItemIndex = closestItem;
    updateActiveItem();
  }
}

// Update active menu item
function updateActiveItem() {
  menuItems.forEach((item, index) => {
    if (index === activeItemIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  bgTexts.forEach((item, index) => {
    if (index === activeItemIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  })
  
}

// Initialize
window.addEventListener('DOMContentLoaded', ()=>{
  initMenu()
  evalHolst()
});

const allMenuItems = document.querySelectorAll('.menu-item')

if (allMenuItems) {
  allMenuItems.forEach((e, i) => {
    e.style.transitionDelay = `${0.025*i}s`;
  })
}

const pageSections = document.querySelectorAll('.section')

window.addEventListener('scroll', function(){
  let valY = window.scrollY;

  pageSections.forEach((e, i) => {
    let contTop = e.offsetTop
    if (valY >= contTop) {
      allMenuItems[i-1]?.classList.remove('active')
      bgTexts[i-1]?.classList.remove('active')
      allMenuItems[i].classList.add('active')
      bgTexts[i].classList.add('active')
    }else
    {
      allMenuItems[i].classList.remove('active')
      bgTexts[i].classList.remove('active')
    }
  })
})


const holstForSpans = document.getElementById("skills");
const elemTop = holstForSpans.offsetTop;

function evalHolst() {
  let width = Math.floor(holstForSpans.offsetWidth / 25);
  let height = Math.floor(holstForSpans.offsetHeight / 25);
  let holst = document.createElement("div");
  holst.classList.add("holst");

  for (let i = 0; i < width * height; i++) {
    let dot = document.createElement("span");
    dot.addEventListener('click', setRandomColor);
    dot.classList.add("dot", "active"); // добавляем active
    holst.appendChild(dot);
  }

  holstForSpans.appendChild(holst);
}

function startDisappearAnimation(){
    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => {
      const delay = Math.random() * 2000; // до 3 сек
      setTimeout(() => {
        dot.classList.remove("active");
      }, delay);
    });
}

function setRandomColor(e) {
  // const dot = e.target; // тот элемент, по которому кликнули
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  holstForSpans.style.setProperty('--dot-color', color);
}


window.onscroll = function(e){
  let Y = window.scrollY;
  if(Y+(window.innerHeight/2) > elemTop) startDisappearAnimation();
}
// evalHolst();