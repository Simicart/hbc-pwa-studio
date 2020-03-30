var SMCONFIGS = {
    merchant_url: "https://magento.pwa-commerce.com/",
    simicart_url: "https://www.simicart.com/appdashboard/rest/app_configs/",
    simicart_authorization: "f95d84b5S2IHxHQxbl3HWg3kGQaw9zQpJVDSZOX",
    notification_api: "/rest/V1/simiconnector/",
    base_name: "",
    logo_url: "https://www.simicart.com/skin/frontend/default/simicart2.0/images/simicart/new_logo_small.png",
    //eg. url is https://codymap.com/magento23 and media url must include pub, value should be 'magento23/pub/'
    media_url_prefix :'pub/'
};

var DEFAULT_COLORS = {
    key_color: '#ff9800',
    top_menu_icon_color: '#ffffff',
    button_background: '#ff9800',
    button_text_color: '#ffffff',
    menu_background: '#1b1b1b',
    menu_text_color: '#ffffff',
    menu_line_color: '#292929',
    menu_icon_color: '#ffffff',
    search_box_background: '#f3f3f3',
    search_text_color: '#7f7f7f',
    app_background: '#ffffff',
    content_color: '#131313',
    image_border_color: '#f5f5f5',
    line_color: '#e8e8e8',
    price_color: '#ab452f',
    special_price_color: '#ab452f',
    icon_color: '#717171',
    section_color: '#f8f8f9',
    status_bar_background: '#ffffff',
    status_bar_text: '#000000',
    loading_color: '#000000',
};

var DASHBOARD_CONFIG = {"app-configs":[{"theme":{"key_color":"#ff9800","top_menu_icon_color":"#ffffff","button_background":"#ff9800","button_text_color":"#ffffff","menu_background":"#1b1b1b","menu_text_color":"#ffffff","menu_line_color":"#292929","menu_icon_color":"#ffffff","search_box_background":"#f3f3f3","search_text_color":"#7f7f7f","app_background":"#ffffff","content_color":"#131313","image_border_color":"#f5f5f5","line_color":"#e8e8e8","price_color":"#ab452f","special_price_color":"#ab452f","icon_color":"#717171","section_color":"#f8f8f9","status_bar_text":"#000000","loading_color":"#000000"},"home":"matrix","product_detail":"cherry_productdetail","app_settings":{"android_app_key":"73081678619"},"app_info_id":"3092","app_name":"Grosgrain & Satin Ribbons & Supplies | HairBow Center","api_version":"0","api_version_title":"API 2.0","url":"https:\/\/www.hairbowcenter.com\/","is_active":true,"status":"3","site_plugins":[{"config":{"enable":"1","config_values":""},"sku":"simi_fblogin_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simicontact_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_appwishlist_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simibarcode_40"},{"config":{"enable":"1","config_values":""},"sku":"magestore_productlabel_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_searchvoice_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simivideo_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simicustompayment_40"},{"config":{"enable":"1","config_values":""},"sku":"checkout_management_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simimixpanel_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simiproductreview_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simisocialshare_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_simicouponcode_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_instant_purchase_40"},{"config":{"enable":"1","config_values":""},"sku":"simi_customchat_40"}],"app_images":{"logo":"https:\/\/www.simicart.com\/media\/simicart\/appdashboard\/app_image\/c3800efa42e4194fac2699c6b73d1ea9.png","icon":"https:\/\/www.simicart.com\/media\/simicart\/appdashboard\/app_image\/eeab69882c8e57a62b3f389df7c7f4d9.png","splash_screen":"https:\/\/www.simicart.com\/media\/simicart\/appdashboard\/app_image\/e052e82039e038f6aaff408e2f5502c1.png"},"splash":{"splash_id":"3017","app_info_id":"3092","color":"#FFFFFF","loading_color":"#000000","is_full":"0"},"android_version":"0.1.0","android_version_code":"1","ios_version":"0.1.0","ios_version_code":"1","ios_link":"","android_link":"","themeitems":{"phone_left_menu_sections":[],"tablet_left_menu_sections":[],"phone_bottom_menu_items":[],"tablet_bottom_menu_items":[],"pb_pages":[]},"language":{"en_US\r\/*------General------*\/\rNetwork response was not ok\rNo Content\rNo Result For\rCancel\rModal has been closed.\rNo connection\rYou are online\rPlease search again\rSearch\rSelect date\rPlease Select\rCan not get your address\rShow\rWarning\rOK\rUpdate now\rAre you sure you want to exit app\rA new version has been released. Please update to use the app\rError\rSomething went wrong\rSelect One\rBack\rSelect date:\rSelect time:\rCATEGORY\rView all\rAll categories\rEnter text in here\rThere are no products matching the selection\rMaximum Number of Characters\rOut of stock\rPlease select the options required\rFrom\rTo\rAdd To Cart\rDescription\rTech Specs\rIncl. Tax\rExcl. Tax\rProduct\rACTIVATED\rClear All\rSELECT A FILTER\rWhat are you looking for?\rCheckout as existing customer\rCheckout as new customer\rCheckout as guest\rCheckout\rAre you sure you want to delete this product\rQuantity\rShipment Details\rItems\rPrice\rIncl Tax\rExcl Tax\rYou have no items in your shopping cart\rShipping Method\rTotals\rPayment Method\rShipping Address\rBilling Address\rNone\rTerm and conditions\rContinue Shopping\rPLACE ORDER\rSubtotal\rShipping\rDiscount\rTax\rGrand Total\rPlease select shipping method\rPlease select payment method\rPlease accept term and condition\rSome errors occured. Please try again later\rName On Card\rCard Type\rCard Number\rExprired Month\rExprired Year\rCVV\rSuccessfully Saved\rSave\rCoupon code\rYour order has been canceled\rAre you sure you want to cancel this order\rProfile\rOr choose address(es) to edit\rOr choose an address to continue\rOr choose an address to edit\rAddress Book\rAdd an address\rPrefix\rFirst Name\rLast Name\rSuffix\rEmail\rCompany\rStreet\rVAT Number\rCity\rPost\/Zip Code\rPhone\rFax\rDate of Birth\rGender\rTax\/VAT number\rPassword\rConfirm Password\rState\rCountry\rAre you sure you want to delete this item\rCurrent Password\rNew Password\rSign Up for Newsletter\rForgot your password?\rSign In\rCreate an Account\rOr\rRegister\rRemember me\rPassword and Confirm password don\\'t match\rDelete address successful\rPlease enter 6 or more characters\rCurrent password don\\'t correct\rPlease check your email to reset password\rThis field is required\rCheck your email and try again\rEnter Your Email\rReset my password\rWelcome %@ %@ Start shopping now\rOrder #\rDate\rShip To\rOrder Total\rStatus\rYou have placed no orders\rReorder\rYou have not received any notifications\rDown for maintenance\r\"Sorry":[]," the app is down for maintenance. Please check back later\"\rStore List\rLanguage\rCurrency\rApp Settings\rHome\rCategory\rNotification History\rMore\rSettings\rOrder History\rStore Locator\rMy Wishlist\rMy Rewards\rScan Now\rContact Us\rGiftCard Products\rCheck Gift code\rThank for your purchase\rCan not create invoice\rComplete order Successfully. Thank your for purchase\r\"Have some errors":[]," please try again\"\rThe order changes to reviewed\rFailure: Your order has been canceled\rCall\rMessage\rWebsite\rPlease re-enter your code\rEnter a coupon code\rApply\rHave a Coupon Code\rShare cancelled\rAlert\rShare success\rShare fail with error: \r\"Please Enter Recipient Name \"\"'!'\"\"\"\r\"Please Enter Recipient Email \"\"'!'\"\"\"\r\"Recipient Email Invalid \"\"'!'\"\"\"\r\"Please enter a Gift Code \"\"'!'\"\"\"\rAdd\/Redeem a Gift Card\rEnter Gift Card Code\rREDEEM GIFT CARD\rADDD GIFT CARD\rADD GIFT CARD\r\"Please enter Gift Code \"\"'!'\"\"\"\rChange\rSelect from List Code\rGIFT CARD\rEnter Gift Card credit amount to pay for this order\rEnter Gift Card Credit\rApply Credit\rUse Gift Card credit to check out\rEnter a Gift Card code\rApply Gift Code\rUse Gift Card to check out\rUse gift card for checkout\rEnter Gift Code to check\rEnter Gift Code\rCheck Gift Code\rGift Card Code\rBalance\rCustomer name\rExpired Date\rAction\rBalance Change\rComments\rOrder\rAdded Date\rAre you sure you want to delete this gift code\rSend to friend\rEmail to friend\rRedeem\rRemove\rRecipient Name (*)\rRecipient Mail (*)\rMessage (*)\rSend Email\rGift Card Code Information\rMy credit balance :\rView Detail\rAdd\/Redeem A Gift Card\rConfirmation\rAre you sure you want to remove this gift code from your list?\rNO\rYES\r\"Your list gift code is empty \"\"'!'\"\"\"\rCurrent Balance\rChanged Time\r\"Your history is empty \"\"'!'\"\"\"\"'!'\"\"\"\rBalance History\rConfirm Address\rThank you for your purchase\rAdd Review\rPlease fill in all required fields\rNickname (*)\rEnter Nickname\rTitle (*)\rEnter title\rDetail (*)\rEnter detail\rSubmit Review\rHOW DO YOU RATE THIS PRODUCT?\rCustomer Reviews\rADD YOUR REVIEW\rONLY USER CAN ADD REVIEW\rOnly user can add review\rBe the first to review this product\rAVAILABLE POINTS\rEqual\rto redeem\rOur policies\rEmail Subscriptions\rPoint balance Update\rSubscribe to receive updates on your point balance\rSubscribe to receive notifications of expiring points in advance\rExpired Point Transaction\rSpending\rYou need to earn more\rto use this rule\r\"Can't execute this action right now\"\"'!'\"\"\"\rERROR\rPlease select for better result\rYou need to grant permission to use this feature\rOpening Hours\rMonday\rTuesday\rWednesday\rThursday\rFriday\rSaturday\rSunday\rSpecial Days\rHoliday\rThe store list is empty\rMap View\rUnable to open\rGet Directions\rSearch By Area\rZip Code\rClear\rSearch By Tag\rVideo\rListening...\rNo result\rShare Wishlist\rYour wishlist is empty\rSpend my Points\rUpdate is available\rTouch the map until you get your desired address\rNEWSLETTER SUBSCRIPTION\rOrder status\rManager Addresses\rDefault Billing\rDefault Shipping\rEdit Account Information\rDefault Address\rAdditional Address Entries\rUse as my default billing address\rUse as my default shipping address\rPlease select a address\rOrder summary\ritem in cart\rYour order number is:\rWe'll email you an order confirmation with details and tracking info\rVoice Search\rAdd new adress\rSubscription option\rGeneral Subscription\rYou have no items in your wish list\rMove to Wishlist\rProceed to Checkout\rYou don't subscribe to our newsletter.\rChange password\rYou have no item in your address book\rMy Account\rAccount Dashboard\rAccount Information\rMy Orders\rMy Downloadable Products\rNewsletter Subscriptions\rMy Reward Points\rLog out\rMY DASHBOARD\rRecent Orders\rList is empty\rContact Information\rBuy now\rDETAILS\rMORE INFORMATION\rREVIEWS\rSHOPPING CART\rApply discount code\rPROCEED TO CHECKOUT\rState\/Province\rShip to this address\rShip to a different address\rNo shipping method available\rORDER SUMMARY\rITEMS IN CART\rPlease choose a billing address\rSEND YOUR COMMENT\rWrite us a note and we'll get back to you as quickly as possible.\rName\rPhone number\rYour message\rSubmit\rSearch Your Product\rVOICE SEARCH\rCart\rFEATURED PRODUCTS\rEdit\rDone\rClose\rrequired\rLoading\rSUCCESS\rDon't Accept\rAccept\rFAIL\rRequest Failed\rNetwork Error\rInvalid\rSome errors occurred. Please try again later\rThe Internet connection appears to be offline\rThe request timed out\rA connection failure occurred\rIn Stock\rAll products\rReview\rWhat is your nickname\rSummary of your review\rLet us know your thought\rHOW DO YOU RATE THIS PRODUCT\rOption\rPrice detail\rMinimize\rFilter\rRelated Products\rSelect\rBasic Info\rRefine\rSort By\rAccount\rSign Out\rLogin\rDo you want to delete the address\rOr choose an address for editing\rOr choose an address\rForgot Password\rYour password\rYour account\rNew Address\rMiddle Name\rEdit Address\rFemale\rMale\rPassword and Confirm password don't match\rPlease select all (*) fields\rOrder Date\rFee Detail\rPayment\rSetting\rMenu\rYou have logged out\rThere are no notifications in history\rStore\rAre you sure that you want to cancel the order\rYour order is cancelled\rThank You Page\rView detail of your order\rThere is no available shipping method\rPlease agree to all the terms and conditions before placing the order\rPlease choose a shipping method and payment methods\rPlease choose a shipping method\rPlease choose a payment method\rkm\rMap\rShow less\rShow more\rOpen\rSpecials Day\rHolidays\rContent\rNo Email Account\rOpen Settings app to set up an email account\rSearch Store\rAll\rNo store match with your searching\rStore List Detail\rLive Chat\rThis app does not have permission to use the camera\rThis device does not have a camera\rAn unknown error occurred\rScanning Unavailable\rScanning Error\rUnable to detect valid code\rNo product matching code\rSay something to looking for...\rTap to try again\rWe didn't quite get that\rPayU Indian\rPayU\rAddress Confirmation\rInvoice\rRewards History\rYou currently have no activity\rExpire on:\rPlease login before using points to spend\rYou will earn\rYou will spend\rEach of %@ gets %@ discount\rYou need to earn more %@ to use this rule\rLogin or Signup\rOnly %@ until %@\rOnly %@ until redeemable\rEqual %@ to redeem\rYou have %@ that are pending for approval\rKlarna\rIpay88\rYou haven't setup email account\r\"You must go to Settings\/ Mail":[]," Contact":[]," Calendars and choose Add Account\"\rSelect Phone\rSelect phone number\rCCAvenue\rPlease press and hold to select the address you want to fill\r2Checkout\rThe provided authorization was invalid\r\"Sorry":[]," %@ is not now available. Please try again later\"\rSorry\rReordering Completed\rWe are so sorry. The system is being maintained. Please try again later\rThis is a demo version.\\nThis text will be removed from live app\rUpgrade available\rRecipient Name\rAre you sure to delete this gift code?\rYour history gift code is empty\rEnter Gift Card credit amount\rEnter amount of gift code\rWishlist\rMy Reward\rMy Giftcard\rWelcome\rStore Pickup\rHours\rAddress &amp;amp;amp; Opening\rStore Detail\rGet your items sent to a pickup location near you.\rLocation above to select a pickup location\rEnter your zip code and hit Search Pickup\rChoose pickup location\rSelected pickup location\rPlease correct your password again\rView detail of your order: #\rYou have placed an order successfully\rYou have logged out. Thank you\rInvalid Email\rSay something to looking for\rComplete\rCanceled\rPending\rHow you can earn points\rHow you can spend points\rEarn points for purchasing order\rPoints\rRegular Price\rSpecial Price\rReset All\rProducts\rYou could receive some Points for purchasing this product\rwas added to your shopping cart\rTerms and Conditions\rCategories\rApp Setting\rAre you sure you want to delete this product?\rYou have logged out Thank you\r\"Call facility is not available\"\"'!'\"\"\"\"'!'\"\"\"\"'!'\"\"\"\r\"Your history gift code is empty \"\"'!'\"\"\"\rAddress &amp; Opening\rDownload app\rHotline\rPosition\rper page\rPlease choose country\rState\/Province (*)\rPlease choose state\rMy Gift Card\rView History\r\"Your balance history is empty \"\"'!'\"\"\"\rAdd\/Redeem a Gift Code\rRedeem Gift Code\rAdd To My List\r\"Your gift code is empty \"\"'!'\"\"\"\rPlease choose\rProducts filter\rThis product is currently out of stock\rDelete wishlist item\rYou online now\rThis product added to cart\rThis wishlist item has been removed from your wishlist\rSharing my wishlist\rYour browser does not support sharing. Please update to the latest version\rWelcome %@ Start shopping now\rReview &amp; Payments\rYou don't subscribe to our newsletter\rMy billing and shipping address are the same\rI agree to the\rProduct Reviews\rYour rating\rNickname\rTitle\rDetail\rYou're reviewing:\rNext\rPlease choose a shipping address\rFree\rFixed\rFlat Rate\rFree - Free Shipping\rAddress\rNewsletter\rProduct was removed to your wishlist\rProduct was added to your wishlist\rTOTAL\rARTICLES\rItem has been moved to Wishlist\rGift code has been deleted successfully\rApp Logo\rImage type invalid\rOr upload your photo\rUpload\rSelect a template\rChoose an images\rScheduled Sending Date\rSelect a time zone\rSender Name\rRecipent Name\rPlease choose a country\rGet notification email when your friend receives Gift Card\rYou will need to find in your friend's address as the shipping address on checkout page.We will send this Gift Card to that address\rSend to friend via post office\rSend to friend via email\rPlease choose a state\rSelect Gift Card value\rGIFT CODE INFORMATION\rPlease enter a Gift Code\rAdd\/Redeem Gift Code\rPlease select the options required (*)\rChoose a selection\rSelect time\rMaximum number of characters:\rCustomize &amp; Add to Cart\rCustomize\rBack to product details\rYour Customization\rQty\rRemaining Download\r404 error\rPage not found\rBack to Home\rSubtotal (Excl. Tax)\rSubtotal (Incl. Tax)\rShipping (Excl. Tax)\rShipping (Incl. Tax)\rGrand Total (Excl. Tax)\rGrand Total (Incl. Tax)\rGift Card Products\rRecipent Email\rCheck\r\"Address fields was automatically filled\"\"'!'\"\"\"\rDistance\r\"Your reward point history is empty \"\"'!'\"\"\"\r\"Please fill in your Code field\"\"'!'\"\"\"\rEnter barcode value\r\"No Code Found\"\"'!'\"\"\"\rEnter QRcode value\rReward Point History\rShop by\rConfirm\rProduct Name\rSearch results for\rAdd a New Address\rPlease select a billing address\rUpdate\rOnly registered users can write reviews\r\"Please login first\"\"'!'\"\"\"\rPlease specify product option(s).\rShare fail with error:":[]}}]};
/*
var DESKTOP_MENU = [
    {
        menu_item_id: 2,
        name: 'Bottom',
        children: [
            {
                name: 'Bottom',
                link: '/venia-bottoms/venia-pants.html'
            },
            {
                name: 'Skirts',
                link: '/venia-bottoms/venia-skirts.html'
            }
        ],
        image_url: 'https://magento23.pwa-commerce.com/pub/media/catalog/category/softwoods-hardwoods-lp-2.jpg',
        link: '/venia-bottoms.html'
    },
    {
        menu_item_id: 3,
        name: 'Top',
        children: [
            {
                name: 'Blouses & Shirts',
                link: '/venia-tops/venia-sweaters.html'
            },
            {
                name: 'Sweaters',
                link: '/venia-tops/venia-blouses.html'
            }
        ],
        link: '/venia-tops.html'
    },
    {
        menu_item_id: 4,
        name: 'Accessories',
        children: [
            {
                name: 'Sub of accessories',
                children: [
                    {
                        name: 'Jewelry',
                        link: '/venia-accessories/venia-jewelry.html'
                    },
                    {
                        name: 'Scarves',
                        link: '/venia-accessories/venia-scarves.html'
                    },
                ]
            },
            {
                name: 'Belts',
                link: '/venia-accessories/venia-belts.html'
            }
        ],
        link: '/venia-accessories.html'
    }
]
*/
