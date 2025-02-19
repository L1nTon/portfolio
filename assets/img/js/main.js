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