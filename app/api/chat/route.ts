import { NextRequest, NextResponse } from "next/server";

const DASHSCOPE_API_KEY = process.env.NEXT_PUBLIC_DASHSCOPE_API_KEY;
const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const DASHSCOPE_URL = `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`;

export async function POST(request: NextRequest) {
  try {
    console.log(DASHSCOPE_API_KEY, APP_ID);
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
    }

    const requestData = {
      input: {
        prompt: message,
        biz_params: {},
      },
    };

    const response = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("百炼API错误:", response.status, errorData);
      return NextResponse.json(
        { error: "智能体服务暂时不可用，请稍后重试" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.output && data.output.text) {
      return NextResponse.json({
        message: data.output.text,
        sessionId: data.output.session_id || sessionId,
        success: true,
      });
    } else {
      return NextResponse.json({ error: "响应格式异常" }, { status: 500 });
    }
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 非流式响应版本
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message");
  const sessionId = searchParams.get("sessionId");

  if (!message) {
    return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
  }

  const requestData = {
    input: {
      prompt: message,
      ...(sessionId && { session_id: sessionId }),
    },
    parameters: {
      incremental_output: true,
    },
    debug: {},
  };

  try {
    const response = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("百炼API错误:", response.status, errorData);
      return NextResponse.json(
        { error: "智能体服务暂时不可用，请稍后重试" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.output && data.output.text) {
      return NextResponse.json({
        message: data.output.text,
        sessionId: data.output.session_id || sessionId,
        success: true,
      });
    } else {
      return NextResponse.json({ error: "响应格式异常" }, { status: 500 });
    }
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
