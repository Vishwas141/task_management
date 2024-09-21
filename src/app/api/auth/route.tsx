import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {

    const token = req.cookies.get("token")?.value;
    
    if(!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    }
    const verifyUser = jwt.verify(token, process.env.JWT_SECRET as string);
    if(!verifyUser) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Authorized" }, { status: 200 });
    
};
