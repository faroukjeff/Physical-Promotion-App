const cf =require('./formServices')
//--------------------------------------------------------------------------------------------------------------------------------//
// to see the answer format type this link in a browser http://dsd-be.herokuapp.com/findUserAnswer?user_id=3147606&form_id=fid_007//
const form_id='fid_007'
//--------------------------------------------------------------------------------------------------------------------------------//
var Kvalue=-1
var feedback=""
var Q2array = []
var Q3array =[]
var Q4array = []
var Q5array = []
var Q6array = []
var Q7array = []
var Q8array = []
var Q9array = []
var Q10array = []
var Q11array = []
var Q12array = []
var WeeklyAnswers = []
var flag

async function main(){
  const users = await cf.getAllClientsId();
  for(user in users){
    getData(users[user],form_id)
  }
  return "Routine on Feedback Started. Check logs for further details"
}

async function generateFeedback(){
  feedback = ""
  generateFeedbackIntro()
  generateFeedbackBody()
  if (flag==true){
    generateFeedbackFooter()
  }
  return feedback
}

function generateFeedbackIntro() {
  feedback+="\n"
  if(notSickAllWeek()){//(left part of tree)
    trainings=timesTrained()
    extraTrainings, times= extraTraining()
    if(Q5andQ8answeredYESonce()){//Q5 and Q8 are answered yes AT LEAST ONCE IN THE WHOLE WEEK
      if(trainings==0 && extraTraining && times==7){
        Kvalue=11
        feedback+="Bra att du utfört fysisk aktivitet med en ansträngningsnivå på minst 15 på Borgskalan varje dag denna vecka. Men vi vill be dig att använda de HIT-pass som ingår i studien. Det är OK att byta ut vissa pass."
      }
      if(trainings>1 || extraTrainings){
        if(times<=5){
          Kvalue=7
          feedback+="Bra att du försökt utföra HIT-pass eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan denna vecka. För din hälsa uppmanar vi dig att utföra två HIT-pass och /eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan varje dag. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
        }else{//taking for granted that the patient did >5 extra trainings
          Kvalue=6
          feedback+="Bra att du försökt utföra HIT-pass eller annan aktivitet med en ansträngningsnivå på minst 15 på Borgskalan varje dag denna vecka."
        }
      }else if(trainings<=10){// from now on we consider the patient did no extra training
        state.Kvalue=2
        state.feedback+="Bra att du försökt utföra HIT-pass denna vecka. För din hälsa uppmanar vi dig att utföra två HIT-pass per dag. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
      }else if (trainings>10){
        state.Kvalue=1
        state.feedback+="Bra att du försökt utföra HIT-pass denna vecka."
      }
    }else{
      if(trainings>1 || extraTrainings){
        if(times<=5){
          Kvalue=8
          feedback+="Bra att du utfört HIT-pass och/eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan vissa dagar. För din hälsa uppmanar vi dig att utföra två HIT-pass och /eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan varje dag. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
        }else if(times>5 && times<7){
          Kvalue=9
          feedback+="Bra att du utfört HIT-pass och/eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan de flesta dagarna. För din hälsa uppmanar vi dig att utföra två HIT-pass och /eller annan fysisk aktivitet med en ansträngningsnivå över 15 på Borgskalan varje dag. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
        }else if(times==7){
          Kvalue=10
          feedback+="Bra att du utfört fysisk aktivitet med en ansträngningsnivå på minst 15 på Borgskalan varje dag denna vecka."
        }
      }else if(trainings<=10){
        state.Kvalue=3
        state.feedback+="Bra att du utfört HIT-pass vissa dagar. För din hälsa uppmanar vi dig att utföra två HIT-pass per dag. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
      }else if (trainings>10 && trainings<14){
        state.Kvalue=4
        state.feedback+="Bra att du utfört HIT-pass nästan alla dagar. För din hälsa uppmanar vi dig att utföra två HIT-pass alla dagar. Fundera på när under dina dagar och vart det passar just dig bäst att genomföra dem."
      }else if (trainings==14){
        state.Kvalue=5
        state.feedback+="Bra att du utfört HIT-passen enligt planering."
      }
    }
  }else{//(right part of tree)
    if(trainedWhenIll()){
      //Grey part of feedback
      if(recoveredFromIllness()){
        if(startedExercisingAgain){
          feedback+="Vi har noterat att du tränat på en dag då du uppgett att du varit sjuk. Det är viktigt att inte träna vid sjukdom. Det kan vara farligt för din hälsa och eventuellt förlänga sjuktiden. Bra att du kommit igång med träningen efter sjukdomen. Känner du dig svagare än innan kan du välja lättare övningar några dagar."
        }else{
          feedback+="Vi har noterat att du tränat på en dag då du uppgett att du varit sjuk. Det är viktigt att inte träna vid sjukdom. Det kan vara farligt för din hälsa och eventuellt förlänga sjuktiden. Bra dock att du är tillbaka och kan börja träna igen. Känner du dig svagare än innan när du börjat träna igen kan du välja lättare övningar några dagar."
        }
      }else if (false){//TODO: cannot execute, I need a query that returns the past state of the patient, if he answered with Q2="Ja" even last week at least once we have to print this line
        feedback+="Vi har noterat att du tränat på en dag då du uppgett att du varit sjuk även denna vecka. Vi vill än en gång påpeka att det är viktigt att inte träna vid sjukdom. Det kan vara farligt för din hälsa och eventuellt förlänga sjuktiden. Hoppa över träningen nu tills du blir frisk. Krya på dig!"
      }else {
        //didn't recover from illness at the end of the week
        feedback+="Vi har noterat att du tränat på en dag då du uppgett att du varit sjuk. Det är viktigt att inte träna vid sjukdom. Det kan vara farligt för din hälsa och eventuellt förlänga sjuktiden. Hoppa över träningen nu tills du blir frisk. Känner du dig svagare än innan när du ska börja träna igen kan du välja lättare övningar några dagar. Krya på dig!"
      }
    }else{
      //Orange part of feedback
      if(recoveredFromIllness()){
        if(startedExercisingAgain){
          feedback+="Klokt att du valde att vila från träning när du var sjuk. Bra att du kommit igång med träningen efter sjukdomen. Känner du dig svagare än innan kan du välja lättare övningar några dagar."
        }else{
          feedback+="Klokt att du valde att vila från träning när du var sjuk. Bra att du är tillbaka och kan börja träna igen. Känner du dig svagare än innan när du börjat träna igen kan du välja lättare övningar några dagar."
        }
      }else if (false){//TODO: cannot execute, I need a query that returns the past state of the patient, if he answered with Q2="Ja" even last week at least once we have to print this line
        feedback+="Klokt att du fortsätter att vila från träning när du var sjuk. Känner du dig svagare än innan när du ska börja träna igen kan du välja lättare övningar några dagar. Krya på dig!"
      }else {
        //didn't recover from illness at the end of the week
        feedback+="Klokt att du valde att vila från träning när du var sjuk. Fortsätt hoppa över träningen tills du blir frisk. Känner du dig svagare än innan när du ska börja träna igen kan du välja lättare övningar några dagar. Krya på dig!"
      }
    }
  }
  return feedback
}
function generateFeedbackBody(){//here comes the switch cases, get ready to do a lot of reading
  feedback+="\n"
  mostCommonAnswer=mostCommonQ4andQ7answer() // the possible returns are 10, 16 and 20
  if(mostCommonQ7Answer()){//case in which Q7 has been answered mostly with yes
    if(minutesOfResting()>=20){//cyan table
      if(mostCommonAnswer==10){
        switch(Kvalue){
          case 1:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 2:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 3:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 4:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;  
          case 5:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 6:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 7:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 8:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 9:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 10:
            feedback+="Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet utan att bli mer sliten. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 11:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
      }
      }else if(mostCommonAnswer==16){
        switch(Kvalue){
          case 1:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 2:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 3:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 4:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;  
          case 5:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 6:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 7:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 8:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 9:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 10:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 11:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
      }
      }else if(mostCommonAnswer==20){
        switch(Kvalue){
          case 1:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 2:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 3:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 4:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;  
          case 5:
            feedback+="Sänk intensiteten något på dina HIT-pass några dagar och kom sen tillbaka till den högre nivån när du fått ork tillbaka. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 6:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 7:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 8:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 9:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 10:
            feedback+="Sänk intensiteten något på dina HIT-pass några dagar och kom sen tillbaka till den högre nivån när du fått ork tillbaka. Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
          case 11:
            feedback+="Bra att du utför all aktiv återhämtning på minst 20 minuter per dag. Minska intensiteten på den aktiva återhämtningen så det verkligen blir återhämtning och inte jobbigt för dig."
            break;
        }
      }
    }else if(minutesOfResting()<20){//pale violet table
      if(mostCommonAnswer==10){
        switch(Kvalue){
          case 1:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 2:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 3:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 4:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;  
          case 5:
            feedback+="Försök ta i så du blir ännu tröttare vid varje styrkepass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 6:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 7:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 8:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 9:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 10:
            feedback+="Försök ta i så du blir ännu tröttare vid varje styrkepass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
      }
      }else if(mostCommonAnswer==16){
        switch(Kvalue){
          case 1:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 2:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 3:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 4:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;  
          case 5:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 6:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."            
            break;
          case 7:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 8:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 9:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 10:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
      }
      }else if(mostCommonAnswer==20){
        switch(Kvalue){
          case 1:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 2:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 3:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 4:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;  
          case 5:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 6:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 7:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 8:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 9:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 10:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig."
            break;
        }
      }
    }
  }else{//Case in which Q7 has been answered mostly with no
    if(minutesOfResting()>=20){//light green table
      if(mostCommonAnswer==10){
        switch(Kvalue){
          case 1:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 2:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 3:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 4:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;  
          case 5:
            feedback+="Försök ta i så du blir ännu tröttare vid varje styrkepass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 6:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 7:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 8:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 9:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 10:
            feedback+="Försök ta i så du blir ännu tröttare vid varje styrkepass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 11:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
      }
      }else if(mostCommonAnswer==16){
        switch(Kvalue){
          case 1:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 2:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 3:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 4:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;  
          case 5:
            feedback+="Utmana dig själv att försöka ta i så du blir ännu tröttare vid HIT-passen ibland. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 6:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 7:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 8:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 9:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 10:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen ibland. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 11:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
      }
      }else if(mostCommonAnswer==20){
        switch(Kvalue){
          case 1:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 2:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 3:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 4:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;  
          case 5:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 6:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 7:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 8:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 9:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 10:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
          case 11:
            feedback+="Bra att du utför aktiv återhämtning på minst 20 minuter per dag. Fortsätt så!"
            break;
        }
      }
    }else if(minutesOfResting()<20){//pale orange table
      if(mostCommonAnswer==10){
        switch(Kvalue){
          case 1:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 2:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 3:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 4:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;  
          case 5:
            feedback+="Försök ta i så du blir ännu tröttare vid varje styrkepass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 6:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 7:
            feedback+="Våga bli ännu tröttare under din träning. Ge inte upp när det börjar ta emot. HIT-passen ska vara riktigt jobbiga. Eventuellt kan en mindre tung variant på övningarna och högre tempo göra att du orkar hela passet och blir tröttare. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 8:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 9:
            feedback+="Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 10:
            feedback+="Försök ta i så du blir ännu tröttare vid varje HIT-pass. Din ansträngningsnivå ska vara på minst 15 på Borgskalan. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
      }
      }else if(mostCommonAnswer==16){
        switch(Kvalue){
          case 1:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 2:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 3:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 4:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;  
          case 5:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen ibland. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 6:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."            
            break;
          case 7:
            feedback+="Fortsätt prova dig fram till en nivå på övningarna som gör att du orkar 3 minuter. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 8:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 9:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 10:
            feedback+="Utmana dig själv att försök ta i så du blir ännu tröttare vid HIT-passen ibland. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
      }
      }else if(mostCommonAnswer==20){
        switch(Kvalue){
          case 1:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 2:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen.!"
            break;
          case 3:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 4:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;  
          case 5:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 6:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela HIT-passen. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 7:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar hela passen och orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 8:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 9:
            feedback+="Du tar i väldigt mycket under dina pass. Försök minska ansträngningsnivån genom att välja lättare övningar eller dra ner på tempot så du orkar göra alla pass. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 10:
            feedback+="Fortsätt genomföra dina HIT-pass såhär. Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
          case 11:
            feedback+="Glöm inte bort den dagliga aktiva återhämtningen på minst 20 minuter då den hjälper dig att återhämta dig från HIT-passen."
            break;
        }
      }
    }
  }
  return feedback
}
function generateFeedbackFooter(){//TO BE COMPLETED
  feedback+="\n"
  if(WeeklyAnswers[5]=='Varierar beroende på plats jag är på' || WeeklyAnswers[5]=='Varierar beroende på dagsform' || WeeklyAnswers[5]=='Varierar för att få omväxling'){
    feedback+='Bra att du använder de olika varianterna av övningarna. Fortsätt så!'
  }else{
    feedback+='Om du klarar fler än en variant av övningar så kan du använda de olika varianterna för att variera dina pass. Känns en variant lätt så öka istället farten så du hinner fler set (varv) av HIT-passet.'
  }
  if(WeeklyAnswers[6]<=2.5){
    feedback+="Om du klarar fler än en variant av övningar så välj en lättare variant av övningar och öka farten så du hinner fler set (varv) av HIT-passet. Försök även göra bytet mellan övningarna så fort som möjligt så du hinner mer."
  
  }


  if(WeeklyAnswers[8]=='Ja'){
    feedback+="Bra presterat att lyckas klara tyngre övningar."
  }
}
function notSickAllWeek(){//true if the patient wasn't feeling ill during the week
  var sick=false
  for(var i= 0; i < Q2array.length; i++)
  {
    if(Q2array[i]==='ja' || Q2array[i]==='Ja'){
      sick=true
    }
  }
  return sick
}
function Q5andQ8answeredYESonce(){//True if the patient answered Q5 or Q8 'yes' at least once
  var rest=false
  for(var i= 0; i < Q5array.length; i++)//asuming Q5 and Q8 have the same lenght (7)
  {
    if((Q5array[i]==='ja' || Q5array[i]==='Ja') || (Q8array[i]==='ja' || Q8array[i]==='Ja')){
      rest=true
    }
  }
  return rest
}
function timesTrained(){//Returns the times the patient trained during the week following HIT program
  var counter=0
  for(var i= 0; i < Q3array.length; i++)//assuming Q3 and Q6 have the same lenght (7)
  {
    if(Q3array[i]==='HIT-pass 1' || Q3array[i]==='HIT-pass 2' || Q3array[i]==='HIT-pass 3'){
      counter++
    }
    if(Q6array[i]==='HIT-pass 1' || Q6array[i]==='HIT-pass 2' || Q6array[i]==='HIT-pass 3'){
      counter++
    }
  }
  return counter
}
function extraTraining(){//True if the patient did workout outside the normal HIT format, returns even the times he did this activity (each lasting more then 15 minutes)
  var extra=false
  var times=0
  for(var i= 0; i < Q9array.length; i++)
  {
    if(Q9array[i]==='Ja'){
      extra=true
      if(Q10array[i]>15){
        times++
      }
    }
    return extra, times
  }
}
function trainedWhenIll(){//True if in a certain day while being ill the patient decided to train
  var trained=false
  for(var i= 0; i < Q3array.length; i++)//assuming Q3 and Q6 have the same lenght (7)
  {
    if(Q2array[i]==='Ja'){
      if((Q3array[i]==='HIT-pass 1' || Q3array[i]==='HIT-pass 2' || Q3array[i]==='HIT-pass 3') || (Q6array[i]==='HIT-pass 1' || Q6array[i]==='HIT-pass 2' || Q6array[i]==='HIT-pass 3') || (Q9array=='Ja')){
        trained = true
      }
    }
  }
}
function recoveredFromIllness(){//he was sick in a certain date but the day after he wasn't 
  var recovered=false
  //var illDay = -1 //debug purposes, unused
  for(var i= 0; i < (Q2array.length-1); i++)
  {
    if(Q2array[i]==='Ja'){
      //illDay=i
      recovered=false
      if(Q2array[i+1]==='Nej')
        recovered = true
    }
  }
  return recovered
}
function startedExercisingAgain(){//to invoke this function we already know that trainedWhenIll = TRUE and recoveredFromIllness = TRUE
  var restartedTraining=false
  for(var i= Q2array.length; i >0; i--)
  {//the idea is that knowing they recovered from illness there has to be a day in which they trained but scanning the array backwards we stop when a "ill day" is found
    if(Q2array[i]==='Ja' && ((Q3array[i]==='HIT-pass 1' || Q3array[i]==='HIT-pass 2' || Q3array[i]==='HIT-pass 3') || (Q6array[i]==='HIT-pass 1' || Q6array[i]==='HIT-pass 2' || Q6array[i]==='HIT-pass 3') || (Q9array=='Ja'))){
      restartedTraining=true
    }else{
      break;
    }
  }
  return restartedTraining
}
function mostCommonQ7Answer(){//True if the patient felt pain in his/her muscles after fraining for most of the week, False otherwise
  for(var i= 0; i < Q7array.length; i++){
    var yesCounter, noCounter=0
    if(Q7array[i]==='Ja'){
      yesCounter++
    }else if(Q7array[i]==='Nej'){
      noCounter++
    }
    if(yesCounter>noCounter){
      return true
    }else{
      return false
    }
  }
}
function minutesOfResting(){//calculates all the minutes in which the patient rested after training
  var minutes=0
  for(var i= 0; i < Q12array.length; i++){
    minutes+=Q12array[i]
  }
  return minutes
}
function mostCommonQ4andQ7answer(){//returns which are the most common answer in Q4 and Q7 to print the body of the feedback
  var low, medium, high =0 //low represents the number of occurrences in which theese 2 questions were answered with a value less then 15, medium is between 15 and 16, high is higher then 17
  for(var i= 0; i < Q4array.length; i++){
    if(Q4array[i]<15){
      low++
    }else if(Q4array[i]>=15 && Q4array[i]<=16){
      medium++
    }else if((Q4array[i]>=17 && Q4array[i]<=20)){
      high++
    }
    if(Q7array[i]<15){
      low++
    }else if(Q7array[i]>=15 && Q7array[i]<=16){
      medium++
    }else if((Q7array[i]>=17 && Q7array[i]<=20)){
      high++
    }
  }
  if(low >= medium && low >= high){
    return 10
  }else if(medium >= low && medium >= high){
    return 16
  }else if(high >= low && high >= medium){
    return 20
  }
}
async function getData(user_ID, form_ID){//retreive all the forms FROM LAST WEEK (if you get more then 7 signal it with an error)
  result = await cf.getLastWeekAnswers(user_ID,form_ID)
    if (result.length != 0){
        var i=0
        for (answer in result) {
          //REMEMBER the answers you retreive are shifted, fid_007-Q1 actually is Q2 and so on
          Q2array.push(result[answer].answers['fid_007-Q1'].Q1)
          Q3array.push(result[answer].answers['fid_007-Q2'].Q2)
          if (Q3array[i] === 'Ej utfört HIT-pass'){
      
          }else{
            Q4array.push(result[answer].answers['fid_007-Q3'].Q3)
            Q5array.push(result[answer].answers['fid_007-Q4'].Q4)
          }
          
          Q6array.push(result[answer].answers['fid_007-Q5'].Q5)
          if (Q6array[i] === 'Ej utfört HIT-pass'){
      
          }else{
            Q7array.push(result[answer].answers['fid_007-Q6'].Q6)
            Q8array.push(result[answer].answers['fid_007-Q7'].Q7)
          }
          Q9array.push(result[answer].answers['fid_007-Q8'].Q8)
          if (Q9array[i] === 'Ja'){
            Q10array.push(result[answer].answers['fid_007-Q9'].Q9)
            Q11array.push(result[answer].answers['fid_007-Q10'].Q10)
          }
          Q12array.push(result[answer].answers['fid_007-Q11'].Q11)
          i+=1
        }
        weeklyResult = await cf.getLastWeeklyFormAnswers(user_ID)
        comparativeResults = await cf.last4WeeklyAnswers(user_ID)
        if (weeklyResult.length != 0){
          flag = true
          WeeklyAnswers[5]=(weeklyResult.answers['fid_005-Q1'].Q1)
          WeeklyAnswers[6]=(weeklyResult.answers['fid_005-Q2'].Q2)
          WeeklyAnswers[8]=(weeklyResult.answers['fid_005-Q3'].Q3)
          //didn't manage to get it working with the 4 week before 
        }
      res_feedback = await generateFeedback();
      cf.saveFeedback(user_ID,res_feedback)
      //return res_feedback
      console.log("Feedback provided: " + res_feedback)
    }else{
      console.log("No answers found for user")
    }
}

exports.main = main;
exports.getData = getData;