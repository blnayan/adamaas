import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientBlogList } from "./client-blog-list";

function makeBlogs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    slug: `post-${i + 1}`,
    excerpt: `Excerpt ${i + 1}`,
    createdAt: "2026-07-01T12:00:00.000Z",
    imageUrl: "/Adamaas_Logo_v2.jpg",
    imageAlt: `Post ${i + 1}`,
  }));
}

describe("ClientBlogList", () => {
  beforeAll(() => {
    // jsdom does not implement smooth scrolling.
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("shows the empty state when there are no posts", () => {
    render(<ClientBlogList blogs={[]} />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("renders all posts without pagination when they fit one page", () => {
    render(<ClientBlogList blogs={makeBlogs(3)} />);
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("paginates past nine posts and navigates to the next page", async () => {
    const user = userEvent.setup();
    render(<ClientBlogList blogs={makeBlogs(10)} />);

    // Page 1 shows the first nine posts only.
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 9")).toBeInTheDocument();
    expect(screen.queryByText("Post 10")).not.toBeInTheDocument();

    await user.click(screen.getByText("2"));

    expect(screen.getByText("Post 10")).toBeInTheDocument();
    expect(screen.queryByText("Post 1")).not.toBeInTheDocument();
  });
});
