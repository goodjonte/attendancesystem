import * as Operations from '../Operations/Operations';

describe('Testing Operations', () => {
    it('Creating correct date strings', () => {
        let date = new Date();
        let year = date.getFullYear();
        let day = date.getDate();
        expect(Operations.GetDateString()).toContain(year.toString());
        expect(Operations.GetDateString()).toContain(day.toString());
    });
    
    it('Getting JWT Payload', () => {
        let testJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        expect(Operations.GetJWTPayload(testJWT)).toStrictEqual({"iat": 1516239022, "name": "John Doe", "sub": "1234567890"});
    });

    it('Get Max Periods In A Day', () => {
        let testArray = [["", 21], ["", 15], ["", 23], ["", 0], ["", 13], ["", 5], ["", 8]];
        expect(Operations.getMaxPeriodsInADay(testArray)).toEqual(23);
    });

    it('Converting time values correctly', () => {
        expect(Operations.ConvertTimeFormatForDB("11:00")).toEqual("2004-05-16T11:00:00");
    });

    it('Generating random guid', () => {
        expect(Operations.generateGuid()).toHaveLength(36);
    });

    it('Getting correct db format time', () => {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        expect(Operations.GetDateDbFormatNoTime()).toContain("T");
        expect(Operations.GetDateDbFormatNoTime()).toContain(year.toString());
        expect(Operations.GetDateDbFormatNoTime()).toContain(month.toString());
        expect(Operations.GetDateDbFormatNoTime()).toContain(day.toString());
    });

    it('Capitalizing Correctly', () => {
        expect(Operations.CapitalizeFirstChar("test")).toEqual("Test");
    });

    it('Stringifying db date values', () => {
        expect(Operations.stringifyDate("2023-07-03T19:34:54")).toEqual("03/07/2023");
    });

    it('Converting attendance enum to string values', () => {
        expect(Operations.AttendanceStatusToString(0)).toBe("Present");
        expect(Operations.AttendanceStatusToString(1)).toBe("Justified");
        expect(Operations.AttendanceStatusToString(2)).toBe("Unjustified");
        expect(Operations.AttendanceStatusToString(3)).toBe("Overseas Justified");
        expect(Operations.AttendanceStatusToString(5)).toBe("Error");
    });
});

