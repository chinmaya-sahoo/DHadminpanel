import React, { useState } from 'react';
import { X, Search, Upload } from 'lucide-react';

const MaterialIconSelector = ({
  selectedIcon,
  onIconSelect,
  onFileUpload,
  categoryType = 'general',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadOption, setShowUploadOption] = useState(false);

  // Material Icons organized by categories
  const materialIcons = {
    income: [
      // Finance Category
      { name: 'schedule', displayName: 'Time Money', keywords: ['time', 'money', 'investment', 'planning', 'clock', 'dollar'] },
      { name: 'bar_chart', displayName: 'Bar Chart', keywords: ['chart', 'analytics', 'reports', 'growth', 'data', 'visualization'] },
      { name: 'mail', displayName: 'Envelope Money', keywords: ['envelope', 'payment', 'bills', 'income', 'mail', 'dollar'] },
      { name: 'savings', displayName: 'Stacked Coins', keywords: ['savings', 'funds', 'currency', 'coins', 'stacked', 'money'] },
      { name: 'phone_android', displayName: 'Mobile Finance', keywords: ['mobile', 'finance', 'banking', 'digital', 'payments', 'smartphone'] },
      { name: 'work', displayName: 'Briefcase', keywords: ['briefcase', 'business', 'work', 'professional', 'assets', 'career'] },
      { name: 'attach_money', displayName: 'Banknote', keywords: ['banknote', 'cash', 'currency', 'earnings', 'money', 'paper'] },
      { name: 'trending_up', displayName: 'Up Down Arrows', keywords: ['transactions', 'fluctuations', 'income', 'expense', 'exchange', 'rates'] },
      { name: 'luggage', displayName: 'Suitcase', keywords: ['suitcase', 'travel', 'expenses', 'business', 'trip', 'investment'] },
      { name: 'account_balance_wallet', displayName: 'Wallet Money', keywords: ['wallet', 'funds', 'spending', 'money', 'bifold', 'dollar'] },

      // Food Category
      { name: 'restaurant', displayName: 'Restaurant', keywords: ['restaurant', 'food', 'dining', 'meal'] },
      { name: 'local_pizza', displayName: 'Pizza', keywords: ['pizza', 'food', 'italian', 'meal'] },
      { name: 'cake', displayName: 'Cake', keywords: ['cake', 'dessert', 'sweet', 'birthday'] },
      { name: 'fastfood', displayName: 'Fast Food', keywords: ['fastfood', 'burger', 'fries', 'quick'] },
      { name: 'icecream', displayName: 'Ice Cream', keywords: ['icecream', 'dessert', 'sweet', 'cold'] },
      { name: 'wine_bar', displayName: 'Wine', keywords: ['wine', 'alcohol', 'drink', 'bar'] },
      { name: 'lunch_dining', displayName: 'Lunch', keywords: ['lunch', 'meal', 'food', 'dining'] },
      { name: 'dinner_dining', displayName: 'Dinner', keywords: ['dinner', 'meal', 'food', 'dining'] },
      { name: 'breakfast_dining', displayName: 'Breakfast', keywords: ['breakfast', 'meal', 'food', 'morning'] },
      { name: 'bakery_dining', displayName: 'Bakery', keywords: ['bakery', 'bread', 'pastry', 'sweet'] },
      { name: 'ramen_dining', displayName: 'Ramen', keywords: ['ramen', 'noodles', 'soup', 'japanese'] },
      { name: 'set_meal', displayName: 'Set Meal', keywords: ['setmeal', 'combo', 'meal', 'food'] },
      { name: 'takeout_dining', displayName: 'Takeout', keywords: ['takeout', 'delivery', 'food', 'order'] },
      { name: 'room_service', displayName: 'Room Service', keywords: ['roomservice', 'hotel', 'food', 'service'] },

      // Shopping Category

      // Transportation Category
      { name: 'directions_car', displayName: 'Car', keywords: ['car', 'vehicle', 'transport', 'automobile'] },
      { name: 'local_gas_station', displayName: 'Gas Station', keywords: ['gas', 'fuel', 'petrol', 'station'] },
      { name: 'train', displayName: 'Train', keywords: ['train', 'transport', 'railway', 'commute'] },
      { name: 'directions_bus', displayName: 'Bus', keywords: ['bus', 'transport', 'public', 'commute'] },
      { name: 'flight', displayName: 'Flight', keywords: ['flight', 'airplane', 'travel', 'trip'] },
      { name: 'directions_boat', displayName: 'Boat', keywords: ['boat', 'ship', 'water', 'transport'] },
      { name: 'motorcycle', displayName: 'Motorcycle', keywords: ['motorcycle', 'bike', 'transport', 'vehicle'] },
      { name: 'pedal_bike', displayName: 'Bicycle', keywords: ['bicycle', 'bike', 'transport', 'exercise'] },
      { name: 'scooter', displayName: 'Scooter', keywords: ['scooter', 'transport', 'vehicle', 'electric'] },
      { name: 'beach_access', displayName: 'Beach', keywords: ['beach', 'vacation', 'travel', 'holiday'] },
      { name: 'surfing', displayName: 'Surfing', keywords: ['surfing', 'sport', 'water', 'beach'] },
      { name: 'sailing', displayName: 'Sailing', keywords: ['sailing', 'boat', 'water', 'sport'] },

      // Entertainment Category
      { name: 'movie', displayName: 'Movie', keywords: ['movie', 'entertainment', 'cinema', 'film'] },
      { name: 'music_note', displayName: 'Music', keywords: ['music', 'audio', 'sound', 'entertainment'] },
      { name: 'sports_esports', displayName: 'Gaming', keywords: ['gaming', 'games', 'esports', 'entertainment'] },
      { name: 'casino', displayName: 'Casino', keywords: ['casino', 'gambling', 'entertainment', 'games'] },
      { name: 'sports_bar', displayName: 'Sports Bar', keywords: ['sportsbar', 'bar', 'sports', 'entertainment'] },
      { name: 'karaoke', displayName: 'Karaoke', keywords: ['karaoke', 'singing', 'entertainment', 'music'] },
      { name: 'bowling_alley', displayName: 'Bowling', keywords: ['bowling', 'sport', 'entertainment', 'game'] },
      { name: 'pool', displayName: 'Pool', keywords: ['pool', 'billiards', 'game', 'entertainment'] },
      { name: 'arcade', displayName: 'Arcade', keywords: ['arcade', 'games', 'entertainment', 'fun'] },
      { name: 'theater_comedy', displayName: 'Comedy', keywords: ['comedy', 'theater', 'entertainment', 'show'] },
      { name: 'festival', displayName: 'Festival', keywords: ['festival', 'event', 'celebration', 'entertainment'] },
      { name: 'celebration', displayName: 'Celebration', keywords: ['celebration', 'party', 'event', 'fun'] },
      { name: 'confetti', displayName: 'Confetti', keywords: ['confetti', 'celebration', 'party', 'festive'] },
      { name: 'balloon', displayName: 'Balloon', keywords: ['balloon', 'party', 'celebration', 'decorative'] },
      { name: 'gift', displayName: 'Gift', keywords: ['gift', 'present', 'celebration', 'surprise'] },

      // Sports Category
      { name: 'fitness_center', displayName: 'Fitness', keywords: ['fitness', 'gym', 'exercise', 'health'] },
      { name: 'sports', displayName: 'Sports', keywords: ['sports', 'athletic', 'exercise', 'fitness'] },
      { name: 'sports_soccer', displayName: 'Soccer', keywords: ['soccer', 'football', 'sport', 'team'] },
      { name: 'sports_basketball', displayName: 'Basketball', keywords: ['basketball', 'sport', 'team', 'game'] },
      { name: 'sports_tennis', displayName: 'Tennis', keywords: ['tennis', 'sport', 'racket', 'game'] },
      { name: 'sports_golf', displayName: 'Golf', keywords: ['golf', 'sport', 'club', 'course'] },
      { name: 'sports_baseball', displayName: 'Baseball', keywords: ['baseball', 'sport', 'bat', 'game'] },
      { name: 'sports_football', displayName: 'Football', keywords: ['football', 'sport', 'team', 'game'] },
      { name: 'sports_volleyball', displayName: 'Volleyball', keywords: ['volleyball', 'sport', 'team', 'game'] },
      { name: 'sports_handball', displayName: 'Handball', keywords: ['handball', 'sport', 'team', 'game'] },
      { name: 'sports_rugby', displayName: 'Rugby', keywords: ['rugby', 'sport', 'team', 'game'] },
      { name: 'sports_cricket', displayName: 'Cricket', keywords: ['cricket', 'sport', 'bat', 'game'] },
      { name: 'sports_hockey', displayName: 'Hockey', keywords: ['hockey', 'sport', 'stick', 'game'] },
      { name: 'sports_mma', displayName: 'MMA', keywords: ['mma', 'fighting', 'sport', 'martial'] },
      { name: 'sports_motorsports', displayName: 'Motorsports', keywords: ['motorsports', 'racing', 'car', 'sport'] },
      { name: 'sports_kabaddi', displayName: 'Kabaddi', keywords: ['kabaddi', 'sport', 'team', 'game'] },
      { name: 'sports_martial_arts', displayName: 'Martial Arts', keywords: ['martialarts', 'fighting', 'sport', 'discipline'] },
      { name: 'sports_gymnastics', displayName: 'Gymnastics', keywords: ['gymnastics', 'sport', 'flexibility', 'strength'] },
      { name: 'sports_swimming', displayName: 'Swimming', keywords: ['swimming', 'sport', 'water', 'exercise'] },
      { name: 'sports_yoga', displayName: 'Yoga', keywords: ['yoga', 'exercise', 'meditation', 'wellness'] },

      // Health Category
      { name: 'medical_services', displayName: 'Medical', keywords: ['medical', 'health', 'doctor', 'hospital'] },
      { name: 'medication', displayName: 'Medication', keywords: ['medication', 'medicine', 'drugs', 'health'] },
      { name: 'vaccines', displayName: 'Vaccines', keywords: ['vaccines', 'immunization', 'health', 'prevention'] },
      { name: 'psychology', displayName: 'Psychology', keywords: ['psychology', 'mental', 'health', 'wellness'] },
      { name: 'healing', displayName: 'Healing', keywords: ['healing', 'recovery', 'health', 'wellness'] },
      { name: 'health_and_safety', displayName: 'Health Safety', keywords: ['health', 'safety', 'protection', 'wellness'] },
      { name: 'sanitizer', displayName: 'Sanitizer', keywords: ['sanitizer', 'hygiene', 'clean', 'health'] },
      { name: 'masks', displayName: 'Masks', keywords: ['masks', 'protection', 'health', 'safety'] },
      { name: 'thermostat', displayName: 'Thermometer', keywords: ['thermometer', 'temperature', 'health', 'fever'] },
      { name: 'monitor_heart', displayName: 'Heart Monitor', keywords: ['heart', 'monitor', 'health', 'cardiac'] },
      { name: 'bloodtype', displayName: 'Blood Type', keywords: ['blood', 'type', 'health', 'medical'] },
      { name: 'biotech', displayName: 'Biotech', keywords: ['biotech', 'science', 'research', 'health'] },
      { name: 'science', displayName: 'Science', keywords: ['science', 'research', 'lab', 'experiment'] },
      { name: 'microscope', displayName: 'Microscope', keywords: ['microscope', 'science', 'research', 'lab'] },
      { name: 'stethoscope', displayName: 'Stethoscope', keywords: ['stethoscope', 'medical', 'doctor', 'health'] },
      { name: 'medical_information', displayName: 'Medical Info', keywords: ['medical', 'information', 'health', 'data'] },
      { name: 'emergency', displayName: 'Emergency', keywords: ['emergency', 'urgent', 'medical', 'help'] },
      { name: 'ambulance', displayName: 'Ambulance', keywords: ['ambulance', 'emergency', 'medical', 'transport'] },

      // Life/Home Category
      { name: 'home', displayName: 'Home', keywords: ['home', 'house', 'residence', 'property'] },
      { name: 'electric_bolt', displayName: 'Electricity', keywords: ['electricity', 'power', 'energy', 'electric'] },
      { name: 'water_drop', displayName: 'Water', keywords: ['water', 'utility', 'bill', 'service'] },
      { name: 'local_laundry_service', displayName: 'Laundry', keywords: ['laundry', 'washing', 'cleaning', 'service'] },
      { name: 'cleaning_services', displayName: 'Cleaning', keywords: ['cleaning', 'service', 'housekeeping', 'maintenance'] },
      { name: 'plumbing', displayName: 'Plumbing', keywords: ['plumbing', 'water', 'repair', 'maintenance'] },
      { name: 'electrical_services', displayName: 'Electrical', keywords: ['electrical', 'electricity', 'repair', 'maintenance'] },
      { name: 'carpenter', displayName: 'Carpenter', keywords: ['carpenter', 'wood', 'repair', 'construction'] },
      { name: 'handyman', displayName: 'Handyman', keywords: ['handyman', 'repair', 'maintenance', 'service'] },
      { name: 'security', displayName: 'Security', keywords: ['security', 'safety', 'protection', 'alarm'] },
      { name: 'local_police', displayName: 'Police', keywords: ['police', 'security', 'law', 'enforcement'] },
      { name: 'local_fire_department', displayName: 'Fire Department', keywords: ['fire', 'emergency', 'safety', 'department'] },
      { name: 'pest_control', displayName: 'Pest Control', keywords: ['pest', 'control', 'exterminator', 'service'] },
      { name: 'yard_work', displayName: 'Yard Work', keywords: ['yard', 'work', 'gardening', 'landscaping'] },
      { name: 'snow_removal', displayName: 'Snow Removal', keywords: ['snow', 'removal', 'winter', 'service'] },
      { name: 'pool_service', displayName: 'Pool Service', keywords: ['pool', 'service', 'maintenance', 'cleaning'] },
      { name: 'hvac', displayName: 'HVAC', keywords: ['hvac', 'heating', 'cooling', 'air'] },
      { name: 'roofing', displayName: 'Roofing', keywords: ['roofing', 'roof', 'repair', 'construction'] },

      // Office Category
      { name: 'business', displayName: 'Business', keywords: ['business', 'company', 'corporate', 'office'] },
      { name: 'work', displayName: 'Work', keywords: ['work', 'job', 'business', 'professional'] },
      { name: 'computer', displayName: 'Computer', keywords: ['computer', 'pc', 'laptop', 'technology'] },
      { name: 'phone_android', displayName: 'Phone', keywords: ['phone', 'mobile', 'communication', 'call'] },
      { name: 'print', displayName: 'Print', keywords: ['print', 'printer', 'document', 'office'] },
      { name: 'keyboard', displayName: 'Keyboard', keywords: ['keyboard', 'typing', 'computer', 'input'] },
      { name: 'mouse', displayName: 'Mouse', keywords: ['mouse', 'computer', 'input', 'device'] },
      { name: 'router', displayName: 'Router', keywords: ['router', 'wifi', 'network', 'internet'] },
      { name: 'usb', displayName: 'USB', keywords: ['usb', 'storage', 'device', 'computer'] },
      { name: 'save', displayName: 'Save', keywords: ['save', 'storage', 'file', 'document'] },
      { name: 'cloud_upload', displayName: 'Cloud Upload', keywords: ['cloud', 'upload', 'storage', 'backup'] },
      { name: 'attach_file', displayName: 'Attach File', keywords: ['attach', 'file', 'document', 'paperclip'] },
      { name: 'language', displayName: 'Language', keywords: ['language', 'translation', 'communication', 'global'] },
      { name: 'campaign', displayName: 'Campaign', keywords: ['campaign', 'marketing', 'promotion', 'advertising'] },
      { name: 'megaphone', displayName: 'Megaphone', keywords: ['megaphone', 'announcement', 'broadcast', 'speaker'] },
      { name: 'call', displayName: 'Call', keywords: ['call', 'phone', 'communication', 'contact'] },
      { name: 'email', displayName: 'Email', keywords: ['email', 'mail', 'communication', 'message'] },

      // Others Category
      { name: 'gift', displayName: 'Gift', keywords: ['gift', 'present', 'surprise', 'celebration'] },
      { name: 'card_giftcard', displayName: 'Gift Card', keywords: ['gift', 'card', 'present', 'reward'] },
      { name: 'redeem', displayName: 'Redeem', keywords: ['redeem', 'reward', 'gift', 'bonus'] },
      { name: 'stars', displayName: 'Stars', keywords: ['stars', 'rating', 'favorite', 'premium'] },
      { name: 'emoji_events', displayName: 'Trophy', keywords: ['events', 'trophy', 'achievement', 'success'] },
      { name: 'military_tech', displayName: 'Military Tech', keywords: ['military', 'tech', 'defense', 'security'] },
      { name: 'emoji_objects', displayName: 'Objects', keywords: ['objects', 'items', 'things', 'misc'] },
      { name: 'emoji_nature', displayName: 'Nature', keywords: ['nature', 'environment', 'outdoor', 'green'] },
      { name: 'emoji_people', displayName: 'People', keywords: ['people', 'person', 'human', 'individual'] },
      { name: 'emoji_food_beverage', displayName: 'Food Beverage', keywords: ['food', 'beverage', 'drink', 'meal'] },
      { name: 'emoji_transportation', displayName: 'Transportation', keywords: ['transportation', 'travel', 'vehicle', 'transport'] },
      { name: 'emoji_symbols', displayName: 'Symbols', keywords: ['symbols', 'signs', 'icons', 'representations'] },
      { name: 'emoji_flags', displayName: 'Flags', keywords: ['flags', 'countries', 'nations', 'patriotic'] },
      { name: 'emoji_activities', displayName: 'Activities', keywords: ['activities', 'sports', 'games', 'entertainment'] },
      { name: 'emoji_travel_places', displayName: 'Travel Places', keywords: ['travel', 'places', 'locations', 'destinations'] },
      { name: 'emoji_animals_nature', displayName: 'Animals Nature', keywords: ['animals', 'nature', 'wildlife', 'pets'] },
      { name: 'emoji_food_drink', displayName: 'Food Drink', keywords: ['food', 'drink', 'beverage', 'consumption'] },
    ],
    expense: [
      // Finance Category
      { name: 'schedule', displayName: 'Time Money', keywords: ['time', 'money', 'investment', 'planning', 'clock', 'dollar'] },
      { name: 'bar_chart', displayName: 'Bar Chart', keywords: ['chart', 'analytics', 'reports', 'growth', 'data', 'visualization'] },
      { name: 'mail', displayName: 'Envelope Money', keywords: ['envelope', 'payment', 'bills', 'income', 'mail', 'dollar'] },
      { name: 'savings', displayName: 'Stacked Coins', keywords: ['savings', 'funds', 'currency', 'coins', 'stacked', 'money'] },
      { name: 'phone_android', displayName: 'Mobile Finance', keywords: ['mobile', 'finance', 'banking', 'digital', 'payments', 'smartphone'] },
      { name: 'work', displayName: 'Briefcase', keywords: ['briefcase', 'business', 'work', 'professional', 'assets', 'career'] },
      { name: 'attach_money', displayName: 'Banknote', keywords: ['banknote', 'cash', 'currency', 'earnings', 'money', 'paper'] },
      { name: 'trending_up', displayName: 'Up Down Arrows', keywords: ['transactions', 'fluctuations', 'income', 'expense', 'exchange', 'rates'] },
      { name: 'luggage', displayName: 'Suitcase', keywords: ['suitcase', 'travel', 'expenses', 'business', 'trip', 'investment'] },
      { name: 'account_balance_wallet', displayName: 'Wallet Money', keywords: ['wallet', 'funds', 'spending', 'money', 'bifold', 'dollar'] },

      // Food Category
      { name: 'restaurant', displayName: 'Restaurant', keywords: ['restaurant', 'food', 'dining', 'meal'] },
      { name: 'local_pizza', displayName: 'Pizza', keywords: ['pizza', 'food', 'italian', 'meal'] },
      { name: 'cake', displayName: 'Cake', keywords: ['cake', 'dessert', 'sweet', 'birthday'] },
      { name: 'fastfood', displayName: 'Fast Food', keywords: ['fastfood', 'burger', 'fries', 'quick'] },
      { name: 'icecream', displayName: 'Ice Cream', keywords: ['icecream', 'dessert', 'sweet', 'cold'] },
      { name: 'wine_bar', displayName: 'Wine', keywords: ['wine', 'alcohol', 'drink', 'bar'] },
      { name: 'lunch_dining', displayName: 'Lunch', keywords: ['lunch', 'meal', 'food', 'dining'] },
      { name: 'dinner_dining', displayName: 'Dinner', keywords: ['dinner', 'meal', 'food', 'dining'] },
      { name: 'breakfast_dining', displayName: 'Breakfast', keywords: ['breakfast', 'meal', 'food', 'morning'] },
      { name: 'bakery_dining', displayName: 'Bakery', keywords: ['bakery', 'bread', 'pastry', 'sweet'] },
      { name: 'ramen_dining', displayName: 'Ramen', keywords: ['ramen', 'noodles', 'soup', 'japanese'] },
      { name: 'set_meal', displayName: 'Set Meal', keywords: ['setmeal', 'combo', 'meal', 'food'] },
      { name: 'takeout_dining', displayName: 'Takeout', keywords: ['takeout', 'delivery', 'food', 'order'] },
      { name: 'room_service', displayName: 'Room Service', keywords: ['roomservice', 'hotel', 'food', 'service'] },

      // Shopping Category

      // Transportation Category
      { name: 'directions_car', displayName: 'Car', keywords: ['car', 'vehicle', 'transport', 'automobile'] },
      { name: 'local_gas_station', displayName: 'Gas Station', keywords: ['gas', 'fuel', 'petrol', 'station'] },
      { name: 'train', displayName: 'Train', keywords: ['train', 'transport', 'railway', 'commute'] },
      { name: 'directions_bus', displayName: 'Bus', keywords: ['bus', 'transport', 'public', 'commute'] },
      { name: 'flight', displayName: 'Flight', keywords: ['flight', 'airplane', 'travel', 'trip'] },
      { name: 'directions_boat', displayName: 'Boat', keywords: ['boat', 'ship', 'water', 'transport'] },
      { name: 'motorcycle', displayName: 'Motorcycle', keywords: ['motorcycle', 'bike', 'transport', 'vehicle'] },
      { name: 'pedal_bike', displayName: 'Bicycle', keywords: ['bicycle', 'bike', 'transport', 'exercise'] },
      { name: 'scooter', displayName: 'Scooter', keywords: ['scooter', 'transport', 'vehicle', 'electric'] },
      { name: 'beach_access', displayName: 'Beach', keywords: ['beach', 'vacation', 'travel', 'holiday'] },
      { name: 'surfing', displayName: 'Surfing', keywords: ['surfing', 'sport', 'water', 'beach'] },
      { name: 'sailing', displayName: 'Sailing', keywords: ['sailing', 'boat', 'water', 'sport'] },

      // Entertainment Category
      { name: 'movie', displayName: 'Movie', keywords: ['movie', 'entertainment', 'cinema', 'film'] },
      { name: 'music_note', displayName: 'Music', keywords: ['music', 'audio', 'sound', 'entertainment'] },
      { name: 'sports_esports', displayName: 'Gaming', keywords: ['gaming', 'games', 'esports', 'entertainment'] },
      { name: 'casino', displayName: 'Casino', keywords: ['casino', 'gambling', 'entertainment', 'games'] },
      { name: 'sports_bar', displayName: 'Sports Bar', keywords: ['sportsbar', 'bar', 'sports', 'entertainment'] },
      { name: 'karaoke', displayName: 'Karaoke', keywords: ['karaoke', 'singing', 'entertainment', 'music'] },
      { name: 'bowling_alley', displayName: 'Bowling', keywords: ['bowling', 'sport', 'entertainment', 'game'] },
      { name: 'pool', displayName: 'Pool', keywords: ['pool', 'billiards', 'game', 'entertainment'] },
      { name: 'arcade', displayName: 'Arcade', keywords: ['arcade', 'games', 'entertainment', 'fun'] },
      { name: 'theater_comedy', displayName: 'Comedy', keywords: ['comedy', 'theater', 'entertainment', 'show'] },
      { name: 'festival', displayName: 'Festival', keywords: ['festival', 'event', 'celebration', 'entertainment'] },
      { name: 'celebration', displayName: 'Celebration', keywords: ['celebration', 'party', 'event', 'fun'] },
      { name: 'confetti', displayName: 'Confetti', keywords: ['confetti', 'celebration', 'party', 'festive'] },
      { name: 'balloon', displayName: 'Balloon', keywords: ['balloon', 'party', 'celebration', 'decorative'] },
      { name: 'gift', displayName: 'Gift', keywords: ['gift', 'present', 'celebration', 'surprise'] },

      // Sports Category
      { name: 'fitness_center', displayName: 'Fitness', keywords: ['fitness', 'gym', 'exercise', 'health'] },
      { name: 'sports', displayName: 'Sports', keywords: ['sports', 'athletic', 'exercise', 'fitness'] },
      { name: 'sports_soccer', displayName: 'Soccer', keywords: ['soccer', 'football', 'sport', 'team'] },
      { name: 'sports_basketball', displayName: 'Basketball', keywords: ['basketball', 'sport', 'team', 'game'] },
      { name: 'sports_tennis', displayName: 'Tennis', keywords: ['tennis', 'sport', 'racket', 'game'] },
      { name: 'sports_golf', displayName: 'Golf', keywords: ['golf', 'sport', 'club', 'course'] },
      { name: 'sports_baseball', displayName: 'Baseball', keywords: ['baseball', 'sport', 'bat', 'game'] },
      { name: 'sports_football', displayName: 'Football', keywords: ['football', 'sport', 'team', 'game'] },
      { name: 'sports_volleyball', displayName: 'Volleyball', keywords: ['volleyball', 'sport', 'team', 'game'] },
      { name: 'sports_handball', displayName: 'Handball', keywords: ['handball', 'sport', 'team', 'game'] },
      { name: 'sports_rugby', displayName: 'Rugby', keywords: ['rugby', 'sport', 'team', 'game'] },
      { name: 'sports_cricket', displayName: 'Cricket', keywords: ['cricket', 'sport', 'bat', 'game'] },
      { name: 'sports_hockey', displayName: 'Hockey', keywords: ['hockey', 'sport', 'stick', 'game'] },
      { name: 'sports_mma', displayName: 'MMA', keywords: ['mma', 'fighting', 'sport', 'martial'] },
      { name: 'sports_motorsports', displayName: 'Motorsports', keywords: ['motorsports', 'racing', 'car', 'sport'] },
      { name: 'sports_kabaddi', displayName: 'Kabaddi', keywords: ['kabaddi', 'sport', 'team', 'game'] },
      { name: 'sports_martial_arts', displayName: 'Martial Arts', keywords: ['martialarts', 'fighting', 'sport', 'discipline'] },
      { name: 'sports_gymnastics', displayName: 'Gymnastics', keywords: ['gymnastics', 'sport', 'flexibility', 'strength'] },
      { name: 'sports_swimming', displayName: 'Swimming', keywords: ['swimming', 'sport', 'water', 'exercise'] },
      { name: 'sports_yoga', displayName: 'Yoga', keywords: ['yoga', 'exercise', 'meditation', 'wellness'] },

      // Health Category
      { name: 'medical_services', displayName: 'Medical', keywords: ['medical', 'health', 'doctor', 'hospital'] },
      { name: 'medication', displayName: 'Medication', keywords: ['medication', 'medicine', 'drugs', 'health'] },
      { name: 'vaccines', displayName: 'Vaccines', keywords: ['vaccines', 'immunization', 'health', 'prevention'] },
      { name: 'psychology', displayName: 'Psychology', keywords: ['psychology', 'mental', 'health', 'wellness'] },
      { name: 'healing', displayName: 'Healing', keywords: ['healing', 'recovery', 'health', 'wellness'] },
      { name: 'health_and_safety', displayName: 'Health Safety', keywords: ['health', 'safety', 'protection', 'wellness'] },
      { name: 'sanitizer', displayName: 'Sanitizer', keywords: ['sanitizer', 'hygiene', 'clean', 'health'] },
      { name: 'masks', displayName: 'Masks', keywords: ['masks', 'protection', 'health', 'safety'] },
      { name: 'thermostat', displayName: 'Thermometer', keywords: ['thermometer', 'temperature', 'health', 'fever'] },
      { name: 'monitor_heart', displayName: 'Heart Monitor', keywords: ['heart', 'monitor', 'health', 'cardiac'] },
      { name: 'bloodtype', displayName: 'Blood Type', keywords: ['blood', 'type', 'health', 'medical'] },
      { name: 'biotech', displayName: 'Biotech', keywords: ['biotech', 'science', 'research', 'health'] },
      { name: 'science', displayName: 'Science', keywords: ['science', 'research', 'lab', 'experiment'] },
      { name: 'microscope', displayName: 'Microscope', keywords: ['microscope', 'science', 'research', 'lab'] },
      { name: 'stethoscope', displayName: 'Stethoscope', keywords: ['stethoscope', 'medical', 'doctor', 'health'] },
      { name: 'medical_information', displayName: 'Medical Info', keywords: ['medical', 'information', 'health', 'data'] },
      { name: 'emergency', displayName: 'Emergency', keywords: ['emergency', 'urgent', 'medical', 'help'] },
      { name: 'ambulance', displayName: 'Ambulance', keywords: ['ambulance', 'emergency', 'medical', 'transport'] },

      // Life/Home Category
      { name: 'home', displayName: 'Home', keywords: ['home', 'house', 'residence', 'property'] },
      { name: 'electric_bolt', displayName: 'Electricity', keywords: ['electricity', 'power', 'energy', 'electric'] },
      { name: 'water_drop', displayName: 'Water', keywords: ['water', 'utility', 'bill', 'service'] },
      { name: 'local_laundry_service', displayName: 'Laundry', keywords: ['laundry', 'washing', 'cleaning', 'service'] },
      { name: 'cleaning_services', displayName: 'Cleaning', keywords: ['cleaning', 'service', 'housekeeping', 'maintenance'] },
      { name: 'plumbing', displayName: 'Plumbing', keywords: ['plumbing', 'water', 'repair', 'maintenance'] },
      { name: 'electrical_services', displayName: 'Electrical', keywords: ['electrical', 'electricity', 'repair', 'maintenance'] },
      { name: 'carpenter', displayName: 'Carpenter', keywords: ['carpenter', 'wood', 'repair', 'construction'] },
      { name: 'handyman', displayName: 'Handyman', keywords: ['handyman', 'repair', 'maintenance', 'service'] },
      { name: 'security', displayName: 'Security', keywords: ['security', 'safety', 'protection', 'alarm'] },
      { name: 'local_police', displayName: 'Police', keywords: ['police', 'security', 'law', 'enforcement'] },
      { name: 'local_fire_department', displayName: 'Fire Department', keywords: ['fire', 'emergency', 'safety', 'department'] },
      { name: 'pest_control', displayName: 'Pest Control', keywords: ['pest', 'control', 'exterminator', 'service'] },
      { name: 'yard_work', displayName: 'Yard Work', keywords: ['yard', 'work', 'gardening', 'landscaping'] },
      { name: 'snow_removal', displayName: 'Snow Removal', keywords: ['snow', 'removal', 'winter', 'service'] },
      { name: 'pool_service', displayName: 'Pool Service', keywords: ['pool', 'service', 'maintenance', 'cleaning'] },
      { name: 'hvac', displayName: 'HVAC', keywords: ['hvac', 'heating', 'cooling', 'air'] },
      { name: 'roofing', displayName: 'Roofing', keywords: ['roofing', 'roof', 'repair', 'construction'] },

      // Office Category
      { name: 'business', displayName: 'Business', keywords: ['business', 'company', 'corporate', 'office'] },
      { name: 'work', displayName: 'Work', keywords: ['work', 'job', 'business', 'professional'] },
      { name: 'computer', displayName: 'Computer', keywords: ['computer', 'pc', 'laptop', 'technology'] },
      { name: 'phone_android', displayName: 'Phone', keywords: ['phone', 'mobile', 'communication', 'call'] },
      { name: 'print', displayName: 'Print', keywords: ['print', 'printer', 'document', 'office'] },
      { name: 'keyboard', displayName: 'Keyboard', keywords: ['keyboard', 'typing', 'computer', 'input'] },
      { name: 'mouse', displayName: 'Mouse', keywords: ['mouse', 'computer', 'input', 'device'] },
      { name: 'router', displayName: 'Router', keywords: ['router', 'wifi', 'network', 'internet'] },
      { name: 'usb', displayName: 'USB', keywords: ['usb', 'storage', 'device', 'computer'] },
      { name: 'save', displayName: 'Save', keywords: ['save', 'storage', 'file', 'document'] },
      { name: 'cloud_upload', displayName: 'Cloud Upload', keywords: ['cloud', 'upload', 'storage', 'backup'] },
      { name: 'attach_file', displayName: 'Attach File', keywords: ['attach', 'file', 'document', 'paperclip'] },
      { name: 'language', displayName: 'Language', keywords: ['language', 'translation', 'communication', 'global'] },
      { name: 'campaign', displayName: 'Campaign', keywords: ['campaign', 'marketing', 'promotion', 'advertising'] },
      { name: 'megaphone', displayName: 'Megaphone', keywords: ['megaphone', 'announcement', 'broadcast', 'speaker'] },
      { name: 'call', displayName: 'Call', keywords: ['call', 'phone', 'communication', 'contact'] },
      { name: 'email', displayName: 'Email', keywords: ['email', 'mail', 'communication', 'message'] },

      // Others Category
      { name: 'gift', displayName: 'Gift', keywords: ['gift', 'present', 'surprise', 'celebration'] },
      { name: 'card_giftcard', displayName: 'Gift Card', keywords: ['gift', 'card', 'present', 'reward'] },
      { name: 'redeem', displayName: 'Redeem', keywords: ['redeem', 'reward', 'gift', 'bonus'] },
      { name: 'stars', displayName: 'Stars', keywords: ['stars', 'rating', 'favorite', 'premium'] },
      { name: 'emoji_events', displayName: 'Trophy', keywords: ['events', 'trophy', 'achievement', 'success'] },
      { name: 'military_tech', displayName: 'Military Tech', keywords: ['military', 'tech', 'defense', 'security'] },
      { name: 'emoji_objects', displayName: 'Objects', keywords: ['objects', 'items', 'things', 'misc'] },
      { name: 'emoji_nature', displayName: 'Nature', keywords: ['nature', 'environment', 'outdoor', 'green'] },
      { name: 'emoji_people', displayName: 'People', keywords: ['people', 'person', 'human', 'individual'] },
      { name: 'emoji_food_beverage', displayName: 'Food Beverage', keywords: ['food', 'beverage', 'drink', 'meal'] },
      { name: 'emoji_transportation', displayName: 'Transportation', keywords: ['transportation', 'travel', 'vehicle', 'transport'] },
      { name: 'emoji_symbols', displayName: 'Symbols', keywords: ['symbols', 'signs', 'icons', 'representations'] },
      { name: 'emoji_flags', displayName: 'Flags', keywords: ['flags', 'countries', 'nations', 'patriotic'] },
      { name: 'emoji_activities', displayName: 'Activities', keywords: ['activities', 'sports', 'games', 'entertainment'] },
      { name: 'emoji_travel_places', displayName: 'Travel Places', keywords: ['travel', 'places', 'locations', 'destinations'] },
      { name: 'emoji_animals_nature', displayName: 'Animals Nature', keywords: ['animals', 'nature', 'wildlife', 'pets'] },
      { name: 'emoji_food_drink', displayName: 'Food Drink', keywords: ['food', 'drink', 'beverage', 'consumption'] },
    ]
  };

  // Get icons based on category type
  const getIconsForCategory = () => {
    if (categoryType === 'income') return materialIcons.income;
    if (categoryType === 'expense') return materialIcons.expense;
    return materialIcons.general;
  };

  // Filter icons based on search term
  const filteredIcons = getIconsForCategory().filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
      setShowUploadOption(false);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Material Icon</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadOption(!showUploadOption)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title="Upload custom icon"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {/* Custom Upload Option */}
      {showUploadOption && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-3">Upload a custom icon</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="custom-icon-upload"
            />
            <label
              htmlFor="custom-icon-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload size={16} />
              Choose File
            </label>
            <button
              onClick={() => setShowUploadOption(false)}
              className="ml-2 px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {filteredIcons.map((icon, index) => (
            <button
              key={index}
              onClick={() => onIconSelect(icon.name)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md flex flex-col items-center justify-center ${selectedIcon === icon.name
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              title={icon.displayName}
            >
              <span className="material-icons text-2xl text-gray-700 mb-1">
                {icon.name}
              </span>
              <span className="text-xs text-gray-600 text-center leading-tight">
                {icon.displayName}
              </span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No icons found matching your search.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click on any Material Icon to select it, or upload your own custom icon.
          Icons help users quickly identify categories.
        </p>
      </div>
    </div>
  );
};

export default MaterialIconSelector;
