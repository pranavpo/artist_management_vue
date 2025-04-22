export const sidebarItems = {
    super_admin: [
        { name: "Create User", route: "/create-user" },
        { name: "View Artist Managers", route: "/view-artist-managers" },
        { name: "View Artists", route: "/view-artists" }
    ],

    artist_manager: [
        { name: "Create User", route: "/create-user" },
        { name: "View Artists", route: "/view-artists" }
    ],

    artist: (artistId) => [
        { name: "Create Song", route: "/create-song" },
        { name: "View Songs", route: `/artists/${artistId}/view-songs` }
    ]
}