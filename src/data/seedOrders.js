import { DEPARTMENTS } from './menuData';

// Generates ~40 realistic sample orders spanning past few hours and earlier today
export const generateSeedOrders = () => {
  const sampleCustomers = [
    { name: 'Aarav Sharma', phone: '9820145210', dept: 'Mechanical Engineering' },
    { name: 'Rohan Deshmukh', phone: '9833412509', dept: 'Computer Engineering' },
    { name: 'Tanvi Patil', phone: '9769018442', dept: 'Information Technology (IT)' },
    { name: 'Kavya Nair', phone: '9819876231', dept: 'Medical & Dental Sciences' },
    { name: 'Siddharth Iyer', phone: '9821430985', dept: 'Computer Engineering' },
    { name: 'Ananya Joshi', phone: '9967123984', dept: 'Management Studies (MBA/BBA)' },
    { name: 'Prathamesh Kadam', phone: '9833908123', dept: 'Civil Engineering' },
    { name: 'Aditya Verma', phone: '9820987654', dept: 'Mechanical Engineering' },
    { name: 'Ishita Sen', phone: '9768124567', dept: 'Architecture & Design' },
    { name: 'Faizan Khan', phone: '9892345678', dept: 'Electrical & Electronics' },
    { name: 'Sneha More', phone: '9821098765', dept: 'Pharmacy Sciences' },
    { name: 'Yash Gaikwad', phone: '9769543210', dept: 'Computer Engineering' },
    { name: 'Vikram Rajput', phone: '9833112233', dept: 'Sports Council / Faculty' },
    { name: 'Pooja Chawla', phone: '9820445566', dept: 'Hotel Management' },
    { name: 'Manish Pandey', phone: '9819778899', dept: 'Mechanical Engineering' },
    { name: 'Sakshi Sawant', phone: '9768223344', dept: 'Information Technology (IT)' },
    { name: 'Rahul Shinde', phone: '9833556677', dept: 'Civil Engineering' },
    { name: 'Shreya Kulkarni', phone: '9821889900', dept: 'Computer Engineering' },
  ];

  const itemTemplates = [
    { name: 'Tandoori Wings (6 pcs)', price: 180, flavour: 'Tandoori' },
    { name: 'Cheese BBQ Wrap', price: 160, flavour: 'BBQ' },
    { name: 'Half Tandoori Chicken Breast', price: 180, flavour: 'Tandoori' },
    { name: 'Cheese Peri Peri Wrap', price: 180, flavour: 'Peri Peri' },
    { name: 'Tandoori Drumsticks (2 pcs)', price: 200, flavour: 'Tandoori' },
    { name: 'Tandoori Leg (Tangdi Kebab)', price: 260, flavour: 'Tandoori' },
    { name: 'Cheese Hotdog', price: 130, flavour: 'BBQ' },
    { name: 'Grilled Chicken Sausages (3 pc)', price: 150, flavour: 'BBQ' },
    { name: 'Peri Peri Wings (6 pcs)', price: 150, flavour: 'Peri Peri' },
    { name: 'Sweet Chilli Wings (6 pcs)', price: 160, flavour: 'Sweet Chilli' },
    { name: 'Full Tandoori Chicken Breast', price: 340, flavour: 'Tandoori' },
    { name: 'Cheese Peri Peri Hotdog', price: 150, flavour: 'Peri Peri' },
  ];

  const pickupLocations = [
    'Smoker Bike Stall (Near Football Ground Gate)',
    'Main Quadrangle Express Counter',
  ];

  const orders = [];
  const now = Date.now();

  // Create 42 orders with distinct timestamps
  for (let i = 1; i <= 42; i++) {
    const cust = sampleCustomers[(i * 3) % sampleCustomers.length];
    const orderIdNum = 1000 + i;
    const orderId = `#BPS-${orderIdNum}`;
    
    // Pick 1 to 3 items
    const itemCount = (i % 3 === 0) ? 3 : (i % 2 === 0 ? 2 : 1);
    const orderItems = [];
    let subtotal = 0;
    let hasCheese = false;
    let hasSauce = false;

    for (let j = 0; j < itemCount; j++) {
      const template = itemTemplates[(i + j * 4) % itemTemplates.length];
      const qty = (j === 0 && i % 4 === 0) ? 2 : 1;
      
      const addons = [];
      if ((i + j) % 2 === 0) {
        addons.push({ name: 'Extra Cheese', price: 40 });
        hasCheese = true;
      }
      if ((i + j) % 3 === 0) {
        addons.push({ name: 'Smoky Sauce Dip', price: 20 });
        hasSauce = true;
      }

      const itemTotal = (template.price + addons.reduce((sum, a) => sum + a.price, 0)) * qty;
      subtotal += itemTotal;

      orderItems.push({
        id: `item-${i}-${j}`,
        name: template.name,
        price: template.price,
        flavour: template.flavour,
        qty,
        addons,
        instructions: (i % 5 === 0) ? 'Make it extra spicy please!' : '',
        total: itemTotal,
      });
    }

    // Apply coupon simulation occasionally
    let discount = 0;
    let couponApplied = null;
    if (subtotal > 300 && i % 3 === 0) {
      discount = 50;
      couponApplied = 'CUP50';
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // Timing distribution:
    // Recent 6 orders are New / Preparing / Ready (Live active)
    // Earlier orders are Completed, 2 are Cancelled
    let status = 'Completed';
    let minutesAgo = 60 + i * 18; // Default spread over the tournament day

    if (i === 42) {
      status = 'New';
      minutesAgo = 2; // Just placed 2 mins ago
    } else if (i === 41) {
      status = 'New';
      minutesAgo = 5;
    } else if (i === 40) {
      status = 'Preparing';
      minutesAgo = 9;
    } else if (i === 39) {
      status = 'Preparing';
      minutesAgo = 14;
    } else if (i === 38) {
      status = 'Ready';
      minutesAgo = 18;
    } else if (i === 37) {
      status = 'Ready';
      minutesAgo = 22;
    } else if (i === 12 || i === 24) {
      status = 'Cancelled';
    }

    const createdAt = new Date(now - minutesAgo * 60 * 1000).toISOString();
    const isUPI = i % 2 !== 0;
    const paymentMethod = isUPI ? 'UPI' : 'Cash';
    
    // In live status, cash may still be pending until collected
    let paymentStatus = 'Paid';
    if (status === 'New' && paymentMethod === 'Cash') {
      paymentStatus = 'Pending';
    } else if (status === 'Cancelled') {
      paymentStatus = isUPI ? 'Refunded' : 'Cancelled';
    }

    // Traffic source
    const trafficSources = ['qr_poster', 'instagram', 'direct', 'qr_table'];
    const trafficSource = trafficSources[i % trafficSources.length];

    orders.push({
      id: orderId,
      items: orderItems,
      customer: {
        name: cust.name,
        phone: cust.phone,
        department: cust.dept,
      },
      status, // 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'
      paymentMethod, // 'UPI' | 'Cash'
      paymentStatus, // 'Paid' | 'Pending' | 'Refunded'
      subtotal,
      discount,
      couponApplied,
      total: finalTotal,
      pickupPoint: pickupLocations[i % pickupLocations.length],
      trafficSource,
      hasCheese,
      hasSauce,
      createdAt,
      updatedAt: createdAt,
      notes: i % 4 === 0 ? 'Urgent, match starts at 4 PM!' : '',
    });
  }

  return orders;
};

export const INITIAL_FEEDBACK = [
  {
    id: 'fb-01',
    orderId: '#BPS-1035',
    customerName: 'Tanvi Patil',
    department: 'Information Technology (IT)',
    rating: 5,
    tags: ['Extra Smoky', 'Juicy', 'Great Sauce'],
    comment: 'The custom bike smoker gives the best charcoal flavour in Kharghar! Cheese tandoori wrap was insane.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'fb-02',
    orderId: '#BPS-1028',
    customerName: 'Aarav Sharma',
    department: 'Mechanical Engineering',
    rating: 5,
    tags: ['Juicy', 'Quick Service'],
    comment: 'Tangdi kebab is massive and super tender. Best stall at the Interdepartmental Cup!',
    createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
  },
  {
    id: 'fb-03',
    orderId: '#BPS-1019',
    customerName: 'Kavya Nair',
    department: 'Medical & Dental Sciences',
    rating: 4,
    tags: ['Extra Smoky', 'Great Sauce'],
    comment: 'Wings were hot and crunchy. Peri-peri dip packs a punch!',
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
  },
  {
    id: 'fb-04',
    orderId: '#BPS-1014',
    customerName: 'Siddharth Iyer',
    department: 'Computer Engineering',
    rating: 5,
    tags: ['Quick Service', 'Juicy'],
    comment: 'Loved the live order tracking on mobile. Walked over right when status hit Ready!',
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
  },
];
