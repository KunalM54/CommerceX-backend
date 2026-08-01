import type { AddressResponse } from "./address.types.js";

export const buildAddressResponse = (address: any): AddressResponse => ({
  id: address._id.toString(),
  type: address.type,
  fullName: address.fullName,
  phone: address.phone,
  line1: address.line1,
  line2: address.line2 ?? "",
  city: address.city,
  state: address.state,
  country: address.country,
  pincode: address.pincode,
  isActive: address.isActive,
  createdAt: address.createdAt,
  updatedAt: address.updatedAt,
});
