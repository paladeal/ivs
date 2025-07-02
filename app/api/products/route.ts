import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../_lib/getCurrentUser";
import { buildError } from "../_lib/buildError";
import products from "../_data/products.json";
import {ProductsResponse} from "@/app/_types/products/ProductsResponse";
export async function GET(request: NextRequest) {
  try {
    await getCurrentUser({ request });
    return NextResponse.json<ProductsResponse>({
      products
    });
  } catch (error) {
    buildError(error)
  }
}
