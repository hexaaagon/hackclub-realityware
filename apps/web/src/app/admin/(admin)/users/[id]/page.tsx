"use server";
import type { account } from "@realityware/database/schema/user";
import { client } from "@realityware/rpc-backend";
import { headers } from "next/headers";
import { SiteBody } from "@/app/admin/(_nav)/site-body";
import { SiteHeader } from "@/app/admin/(_nav)/site-header";
import ServerError from "@/app/admin/(partials)/error-pages/server-error";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

export default async function UserPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const headerList = await headers();

	const response = await client.admin.users[":id"].$get(
		{
			param: { id },
		},
		{
			headers: Object.fromEntries(headerList.entries()),
		},
	);
	const data = (await response.json()) as
		| {
				success: false;
				message: string;
		  }
		| {
				success: true;
				user: typeof account.$inferSelect;
		  };

	if (!data.success) return <ServerError reason={data} />;

	return (
		<>
			<SiteHeader
				type="admin"
				params={[
					{
						i: 2,
						s: [data.user.displayName],
					},
				]}
			/>
			<SiteBody>
				<main>
					<div>
						<h2 className="text-2xl">User</h2>
					</div>
					<ChartAreaInteractive />
				</main>
			</SiteBody>
		</>
	);
}
