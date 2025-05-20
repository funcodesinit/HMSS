import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(req: Request) {
  try {

    const guests = await prisma.guest.findMany();

    return NextResponse.json(guests, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching guests:", error);
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      address,
      idNo,
      city,
      province,
      country,
      purpose_tourist,
      purpose_conference,
      purpose_group,
      purpose_business,
      paymentMethod,
      signature
    } = body

    if (!body || Object.keys(body).length === 0) {
      console.error("Error: Empty request body");
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    const processedInput = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      company: company,
      address: address,
      idNo: idNo,
      city: city,
      province: province,
      country: country,
      purpose_tourist: purpose_tourist,
      purpose_conference: purpose_conference,
      purpose_group: purpose_group,
      purpose_business: purpose_business,
      paymentMethod: paymentMethod,
      signature: signature
    }

    const guest = await prisma.guest.create({
      data: processedInput
    });

    return NextResponse.json({
      success: true,
      guest
    }, { status: 201 });

  } catch (err) {
    console.log("Error creating guest:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });

  }


}


