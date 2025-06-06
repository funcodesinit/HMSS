import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const skip = (page - 1) * pageSize;

    // Filters
    const categoryIds = searchParams.get("categoryId")?.split(",").map(Number).filter(id => !isNaN(id)) || [];
    const categoryNames = searchParams.get("category")?.split(",").map(name => name.trim()) || [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");

    // Build filter object
    const filters: any = {};

    if (categoryIds.length > 0 || categoryNames.length > 0) {
      filters.OR = [];

      if (categoryIds.length > 0) {
        filters.OR.push({
          categoryId: { in: categoryIds },
        });
      }

      if (categoryNames.length > 0) {
        filters.OR.push({
          category: {
            name: { in: categoryNames, mode: "insensitive" },
          },
        });
      }
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice && !isNaN(Number(minPrice))) filters.price.gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) filters.price.lte = Number(maxPrice);
    }

    if (size) {
      filters.images = {
        some: {
          size: {
            size,
          },
        },
      };
    }

    // Query products with filters and pagination
    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: { select: { name: true } }, // Include category name
      },
      skip,
      take: pageSize,
    });

    // Get total count of products matching filters
    const totalProducts = await prisma.product.count({ where: filters });

    // Transform the response to match the expected format
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      thumb: product.thumb,
      categoryId: product.categoryId,
      categoryName: product.category?.name || null, // Include category name in response
      description: product.description,
      stock: product.stock,
      section: product.section,

    }));

    return NextResponse.json(
      {
        total: totalProducts,
        page,
        pageSize,
        totalPages: Math.ceil(totalProducts / pageSize),
        data: formattedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

type ProductRequest = {
  thumb?: string;
  name: string;
  description: string;
  price: string | number;
  discount?: string | number;
  stock?: string | number;
  categoryId: string | number;
  isPublished?: boolean;
  section?: 'BAR' | 'RESTAURANT' | 'KITCHEN';
};


cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
});



export async function POST(req: Request) {
  try {
    const body: ProductRequest = await req.json();

    const {
      thumb,
      name,
      description,
      price,
      discount,
      stock,
      isPublished,
      categoryId,
      section, // <- new field
    } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const validSections = ['BAR', 'RESTAURANT', 'KITCHEN'];
    if (section && !validSections.includes(section)) {
      return NextResponse.json(
        { error: `Invalid section value. Must be one of: ${validSections.join(', ')}` },
        { status: 400 }
      );
    }

    let thumbUrl: string | undefined = undefined;

    //upload thumb to Cloudinary if provided
    if (thumb) {
      try {
        // const uploadResponse = await cloudinary.v2.uploader.upload(thumb, {
        //   folder: "products",
        // });
        const uploadResponse = await cloudinary.v2.uploader.upload(thumb, {
          folder: "frontdesk/products",
        });

        body.thumb = uploadResponse.secure_url; // You did this...
        thumbUrl = uploadResponse.secure_url; // ...but this is needed for `processedInput`
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
      }
    }

    const priceNum = parseFloat(price);
    const discountNum = discount ? parseFloat(discount) : 0;
    const stockNum = parseInt(stock);

    if (isNaN(priceNum) || isNaN(stockNum) || (discount && isNaN(discountNum))) {
      return NextResponse.json({ error: "Price, stock, or discount has invalid format" }, { status: 400 });
    }


    const processedInput = {
      // thumb: thumbUrl,
      name,
      description,
      price: priceNum,
      discount: discountNum,
      stock: stockNum,
      isPublished: Boolean(isPublished),
      categoryId: parseInt(categoryId),
      section, // <- must match enum: "BAR", "RESTAURANT", etc.
    };

    const prod = await prisma.product.create({
      data: processedInput,
    });

    return NextResponse.json({ success: true, prod }, { status: 201 });

  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
