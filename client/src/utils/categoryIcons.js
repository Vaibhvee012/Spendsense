import {
  RiRestaurantLine,
  RiTaxiLine,
  RiShoppingBag3Line,
  RiBriefcaseLine,
  RiHomeLine,
  RiKeyLine,
  RiHeartPulseLine,
  RiMore2Line,
  RiBookLine,
  RiFilmLine,
  RiFileList3Line,
  RiWalletLine,
  RiPriceTag3Line, // fallback
} from 'react-icons/ri';

export const categoryIconMap = {
  Food: RiRestaurantLine,
  Travel: RiTaxiLine,
  Shopping: RiShoppingBag3Line,
  Work: RiBriefcaseLine,
  House: RiHomeLine,
  Rent: RiKeyLine,
  Health: RiHeartPulseLine,
  Miscellaneous: RiMore2Line,
  Education: RiBookLine,
  Entertainment: RiFilmLine,
  Bills: RiFileList3Line,
  Salary: RiWalletLine,
};

export const getCategoryIcon = (categoryName) => categoryIconMap[categoryName] || RiPriceTag3Line;