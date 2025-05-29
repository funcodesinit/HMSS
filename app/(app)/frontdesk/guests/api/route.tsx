import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Search query
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Filters
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const company = searchParams.get("company");

    // Build dynamic where clause
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ];
    }

    if (country) {
      whereClause.country = { equals: country, mode: "insensitive" };
    }

    if (city) {
      whereClause.city = { equals: city, mode: "insensitive" };
    }

    if (company) {
      whereClause.company = { equals: company, mode: "insensitive" };
    }

    // Query DB
    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // optional: sort by recent
      }),
      prisma.guest.count({ where: whereClause }),
    ]);

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

 

<<<<<<< HEAD
 

=======
>>>>>>> 9caa6e2523b37c39dbada7f3aa7fdcd1ee386a6f
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


