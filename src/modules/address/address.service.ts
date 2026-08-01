import { AppError } from "../../utils/AppError.js";
import { Address, AddressType } from "./address.model.js";
import { buildAddressResponse } from "./address.mapper.js";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "./address.validation.js";
import mongoose from "mongoose";

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

export const createAddress = async (
  userId: string,
  payload: CreateAddressDto,
) => {
  const address = await Address.create({
    ...payload,
    type: payload.type as AddressType,
    user: userId,
  });

  return buildAddressResponse(address);
};

export const getMyAddresses = async (
  userId: string,
  query: { type?: string },
) => {
  const filter: Record<string, unknown> = { user: userId, isActive: true };

  if (query.type) {
    filter.type = query.type;
  }

  const addresses = await Address.find(filter).sort({ createdAt: -1 });

  return addresses.map(buildAddressResponse);
};

export const getAddressById = async (userId: string, id: string) => {
  assertValidObjectId(id, "Invalid address id");

  const address = await Address.findOne({
    _id: id,
    user: userId,
    isActive: true,
  });

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  return buildAddressResponse(address);
};

export const updateAddress = async (
  userId: string,
  id: string,
  payload: UpdateAddressDto,
) => {
  assertValidObjectId(id, "Invalid address id");

  const address = await Address.findOne({ _id: id, user: userId });

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  if (payload.type !== undefined) {
    address.type = payload.type as any;
  }

  if (payload.fullName !== undefined) {
    address.fullName = payload.fullName;
  }

  if (payload.phone !== undefined) {
    address.phone = payload.phone;
  }

  if (payload.line1 !== undefined) {
    address.line1 = payload.line1;
  }

  if (payload.line2 !== undefined) {
    address.line2 = payload.line2;
  }

  if (payload.city !== undefined) {
    address.city = payload.city;
  }

  if (payload.state !== undefined) {
    address.state = payload.state;
  }

  if (payload.country !== undefined) {
    address.country = payload.country;
  }

  if (payload.pincode !== undefined) {
    address.pincode = payload.pincode;
  }

  await address.save();

  return buildAddressResponse(address);
};

export const deleteAddress = async (userId: string, id: string) => {
  assertValidObjectId(id, "Invalid address id");

  const address = await Address.findOne({ _id: id, user: userId });

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  if (!address.isActive) {
    throw new AppError(400, "Address is already inactive");
  }

  address.isActive = false;
  await address.save();

  return buildAddressResponse(address);
};
