export type SocialMedia = 'facebook' | 'linkedin' | 'twitter';


export type User = {
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    adminRole: string,
    password: string,
    salt: string,
    gender: number,
    phone: string,
    address: string,
    lastConnection: Date,
    hashReset: string,
    saltReset: string,
    zone: string,
    userToCoach: string
}

export type Opportunity = {
        title: string,
        isPublic: boolean,
        isValidated: boolean,
        isArchived: boolean,
        isExternal: boolean,
        link: string,
        externalOrigin: string,
        company: string,
        recruiterName: string,
        recruiterFirstName: string,
        recruiterMail: string,
        contactMail: string,
        recruiterPosition: string,
        recruiterPhone: string,
        date: Date,
        address: string,
        description: string,
        companyDescription: string,
        skills: string,
        prerequisites: string,
        department: string,
        contract: string,
        startOfContract: Date,
        endOfContract: Date,
        isPartTime: boolean,
        numberOfPositions: number,
        beContacted: boolean,
        message: string,
        driversLicense: boolean,
        workingHours: string,
        salary: string,
        otherInfo: string,
        businessLines: {name: string, order: string}[],
        candidatesId: string[],
        isAdmin: boolean,
        shouldSendNotifications: boolean,
        isCopy: boolean,
        locations: object,
        visit: string,
        visitor: string,
        urlParams: object
        // for put:
        id?: string
}

export type OpportunityJoin = {
    status: number,
    seen: boolean,
    bookmarked: boolean,
    archived: boolean,
    recommended: boolean,
    note: string
}

export type MailContactUs = {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    structure: string,
    message: string,
    heardAbout: object,
    cgu: boolean
  
}

export type PutCandidate = {
    employed: boolean,
    contract: string,
    endOfContract: Date,
    hidden: boolean,
    note: string,
    url: string,
    lastModifiedBy: string
}