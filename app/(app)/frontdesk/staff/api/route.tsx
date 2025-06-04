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
    const [user, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // optional: sort by recent
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        data: user,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

 

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       company,
//       address,
//       idNo,
//       city,
//       province,
//       country,
//       purpose_tourist,
//       purpose_conference,
//       purpose_group,
//       purpose_business,
//       paymentMethod,
//       signature
//     } = body

//     if (!body || Object.keys(body).length === 0) {
//       console.error("Error: Empty request body");
//       return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
//     }

//     const processedInput = {
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       phoneNumber: phoneNumber,
//       company: company,
//       address: address,
//       idNo: idNo,
//       city: city,
//       province: province,
//       country: country,
//       purpose_tourist: purpose_tourist,
//       purpose_conference: purpose_conference,
//       purpose_group: purpose_group,
//       purpose_business: purpose_business,
//       payment: paymentMethod,
//       signature: signature
//     }

//     const user = await prisma.user.create({
//       data: processedInput
//     });

//     return NextResponse.json({
//       success: true,
//       user
//     }, { status: 201 });

//   } catch (err) {
//     console.log("Error creating user:", err);
//     return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });

//   }


// }


