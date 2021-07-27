interface SongRole {
    role: string,
    person: string[]
}

interface PersonRole {
    name: string,
    roles: string[]
}

class Song {
    get vocalists() {
        return this.roles.filter(r => r.role.includes('vocalist'));
    }

    get roles() {
        let roles: SongRole[] = [];

        this.personnel.forEach(p => {
            p.roles.forEach(r => {
                // checks if array `role` already has a role `r
                let role = roles.find(x => x.role == r);

                // if it does, add that
                if (role) {
                    role.person.push(p.name);
                } else {
                    roles.push({
                        role: r,
                        person: [p.name]
                    });
                }
            });
        });

        return roles;
    }

    constructor(public name: string,
        public album: Album,
        public pageId: string,
        public personnel: PersonRole[],
        public writer?: SongRole
    ) { }
}

class Album {
    public songs: Song[] = [];

    constructor(public name: string, public pageId: string) {

    }
}

export {
    Song,
    Album,
    SongRole,
    PersonRole
}