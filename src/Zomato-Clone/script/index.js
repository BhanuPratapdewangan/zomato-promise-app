
let isOrderAccepted = false;
let hasTheRestaurantSeenYourOrder = false;
let isValetFound = false;
let isOrderDelivered = false;
let valetTimer = null;
let restaurantTimer = null;
let deliveryTimer = null;

window.addEventListener('load', () => {
    document.getElementById('acceptOrder').addEventListener('click', () => {
        askRestaurantToAcceptOrReject();
    })

    document.getElementById('findValets').addEventListener('click', () => {

        if(isOrderAccepted==true || isValetFound==true) { startSearchingForValets(); checkIfAssignedForValet(); }
        else alert('Valet is not Found | please first accept order by restaurant');
    })

    document.getElementById('orderDelivered').addEventListener('click', () => {
        if(isValetFound) { checkIfOrderedDelivered(); }
        
    })

    checkIfOrderAcceptedFromRestaurant()
    .then(isOrderAccepted => {
        console.log('Order accepted', isOrderAccepted);
        if(isOrderAccepted)
        {
            startPreparingYourOrder();
            alert('Order acceped');
            setTimeout(() => {
                alert('How was the food | please given rating for food and delivery service');
            },30000)
        } else
        {
            alert('Sorry restaurant could not accept your order | return your payment in your zomato wallet');
        }
    })
    .catch(err => {
        console.error(err);
        alert('Something went wrong | please try again later ');
    })

})


// Ask restaurant order accept or reject
const askRestaurantToAcceptOrReject = () => {
    isOrderAccepted = confirm('Should the restaurant accept order');
    hasTheRestaurantSeenYourOrder = true;
}

// Check if order accept by restaurant or not
const checkIfOrderAcceptedFromRestaurant = () => {
    return new Promise((resolve, reject) => {
        let restaurantTimer =  setInterval(() => {
            console.log('Check if order accept or not');
            if(!hasTheRestaurantSeenYourOrder) return;
            
            if(isOrderAccepted==true) resolve(true);
            else resolve(false);

            clearInterval(restaurantTimer);
        },1000);
    })
}

// Start preparing your orders
const startPreparingYourOrder = () => {
    Promise.allSettled([
        updateStatusOrder(),
        updateMapView(),
        checkIfAssignedForValet(),
        checkIfOrderedDelivered()
    ])
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err);
    })
}

// Update status order
const updateStatusOrder = () => {
    setTimeout(() => {
        document.getElementById('statusForCustomer').innerText = (isValetFound==true) ? 'Order delivered successfully...!': 'Preparing your order';
    },1000);
}

// Update Map View
const updateMapView = () => {
    setTimeout(() => {
        document.getElementById('map').style.opacity = '1';
    },1000);
}

// Searching valet for order delivering

const startSearchingForValets = () => {
    // get the location of valets
    // find the valet to stay in minimum distance of restaurant to delivery address.
    // assigned the valet for order delivery


    //Step-1 get the location of valets

    var valetsPromise = [];
    for(i=0;i<4;i++)
    { 
        valetsPromise.push(getRandomDriver());
    }
    console.log(valetsPromise);
    
    Promise.race(valetsPromise)
    .then(selectValets => {
        console.log('Selected Valet => ', selectValets);
        isValetFound = true;
    })

}

const getRandomDriver = () => {
    // Fake delay to find the radom driver
    return new Promise((resolve, reject) => {
        let timeout = parseInt(Math.random()*1000);
        setTimeout(() => {
            resolve('Valets '+ timeout);
        },timeout);
    })
}

const checkIfAssignedForValet = () => {
    return new Promise((resolve, reject) => {
       valetTimer =  setInterval(() => {
            if(isValetFound==true) {updateValetDetails();}
            resolve('Order has been assigned to the valet')

            clearInterval(valetTimer);
        }, 1500);
    })
}

const updateValetDetails = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(isValetFound)
            {
                document.getElementById('status').style.display = 'none';
                document.getElementById('valet-status').style.display = 'block';
                document.getElementById('call').style.display = 'block';
            }
            resolve('Valet Details is updated');
            clearInterval(valetTimer);
        },1000);
    })
}

const checkIfOrderedDelivered = () => {
    return new Promise((resolve, reject) => {
        deliveryTimer =  setInterval(() => {

            if(isOrderDelivered)
            resolve('Order delivered by valet');
            console.log('Order delivered by valet');
            updateStatusOrder();
            clearInterval(deliveryTimer);
        },2000);
    })
}

