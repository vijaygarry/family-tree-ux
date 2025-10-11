import { format, parseISO} from "date-fns";

// Input date is in ISO 8601 i.e. "2003-12-02T05:00:00.000+00:00"
// This function asumes date is in UTC
export const formatDate = (dateString) => {
    if(dateString) {
        return format(new Date(dateString), "dd-MMM-yyyy");
    } else {
        return '';
    }
}

//Input date is in ISO 8601 i.e. "2003-12-02T05:00:00.000+00:00"
// Response will be YYYY-MM-DD format like 2003-12-02
export const getDateInYYYYMMDD = (dateString) => {
    if(dateString) {
        return new Date(dateString).toISOString().split("T")[0];
    } else {
        return '';
    }
}

//Input date gives date string in YYYY-MM-DD format like "2003-12-02" 
// But backend expect date in ISO 8601 format.
export const getDateInISO8601 = (dateString) => {
    if(dateString) {
        return new Date(dateString).toISOString();
    } else {
        return '';
    }
}

// Input date is in ISO 8601 i.e. "2003-12-02"
// This function simply convert date to "02-Dec-2003" format without timezone conversion
export const formatISODateToddMMMyyyy = (localISODate) => {
    if(localISODate) {
        return format(parseISO(localISODate), "dd-MMM-yyyy");
    } else {
        return '';
    }
}
